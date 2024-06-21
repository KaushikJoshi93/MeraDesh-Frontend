import { Avatar, Box, Button, TextField, Typography } from '@mui/material'
import React from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import make_request from '../axios';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '70%', sm: '70%', md: '50%' },
    bgcolor: 'background.paper',
    border: '0.5px solid #000',
    boxShadow: 24,
    p: 4,
    display: "flex",
    flexDirection: 'column'

};

const EditProfile = () => {
    const [file, setFile] = useState(null);
    const [value, setValues] = useState({ name: "", email: "", about: "", password: "", photo: null });
    const [enteredCount, setEnteredCount] = useState(0);
    const local_user = useSelector(state => state.auth.user); //this is the user object
    const queryClient  = useQueryClient();
    const { data: userData, isFetched } = useQuery("loadUser", async () => {
        let userId = local_user._id;
        let token = local_user.token;
        let response = await fetch(import.meta.env.VITE_BACKEND_URL + '/api/user/' + userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        console.log("in...")
        return await response.json()

    });
    const { mutate: updateUserData, isLoading, isSuccess, isError } = useMutation({
        mutationFn: async ({ userData, userId, token }) => {
                let response = await make_request(token).put(import.meta.env.VITE_BACKEND_URL + '/api/user/' + userId, userData)
                return response.data;
        }
    })

    const handleChange = (val, e) => {
        const Ansvalue = val == 'photo' ? e.target.files[0] : e.target.value;
        console.log(value);
        console.log(e.target.value)
        if (enteredCount == 0) {
            console.log(userData["name"])
            setValues({ ...value, name: userData["name"] || "", email: userData["email"] || "", about: userData["about"] || "", [val]: Ansvalue })
            let newCount = enteredCount;
            setTimeout(() => {
                setEnteredCount(newCount + 1);
            }, 3000);
        } else {
            setValues({ ...value, [val]: Ansvalue });
        }

    }

    const handleSubmit = () => {
        let userData = new FormData();
        value.name && userData.append('name', value.name);
        value.email && userData.append('email', value.email);
        value.about && userData.append('about', value.about);
        value.password && userData.append('password', value.password);
        value.photo && userData.append('photo', value.photo);

        updateUserData({ userData, userId: local_user._id, token: local_user.token }, { onSuccess: () => {
            toast.success("Successfully!! Updated Profile", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
            setValues({ name: "", email: "", about: "", password: "", photo: null });
            setFile(null)
            setEnteredCount(0)
            queryClient.invalidateQueries("loadUser")
            console.log('inside edit profile');
        }})



    }

    return (
        <Box sx={style}>
            {/* wrapper box */}
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: "18px"
            }}>
                <Typography sx={{ color: "orangered", fontSize: "22px" }}>Edit Profile</Typography>
                <Avatar sx={{ width: "70px", height: '70px' }} src={file ? URL.createObjectURL(file) : import.meta.env.VITE_BACKEND_URL + `/api/user/photo/${local_user._id}`} />

                <label htmlFor="fileUpload" >
                    <Button endIcon={<FileUploadIcon />} variant="contained" sx={{ bgcolor: "#E6E6E6", color: "black", ':hover': { bgcolor: "gray" } }} onClick={() => document.getElementById("fileUpload").click()}>
                        Upload
                    </Button>
                </label>
            </Box>
            <form onSubmit={(e) => { e.preventDefault() }} style={{ display: "flex", alignItems: "flex-start", flexDirection: "column", width: "100%", gap: "19px" }} encType="multipart/form-data">
                {/* photo field */}
                <input type="file"
                    style={{ display: 'none' }}
                    id="fileUpload" accept='image/*' onChange={(e) => { setFile(e.target.files[0]); handleChange('photo', e) }} />
                {/* name field */}
                <TextField id="standard-basic" label="Name" variant="standard" style={{ width: "100%" }} value={value.name.length ? value.name : enteredCount < 1 ? userData?.name : value.name} onChange={(e) => { handleChange("name", e) }} type="text" />
                {/* about field */}
                <TextField id="standard-basic" label="About" variant="standard" style={{ width: "100%" }} value={value.about.length ? value.about : enteredCount < 1 ? userData?.about : value.about} onChange={(e) => { handleChange("about", e) }} />
                {/* email field */}
                <TextField id="standard-basic" label="Email" variant="standard" style={{ width: "100%" }} type="email" value={value.email.length ? value.email : enteredCount < 1 ? userData?.email : value.email} onChange={(e) => { handleChange("email", e) }} />
                {/* password field */}
                <TextField id="standard-basic" label="Password" variant="standard" style={{ width: "100%" }} type="password" value={value.password} onChange={(e) => { handleChange("password", e) }} />
                {/* submit button */}
                <Button variant="contained" style={{ backgroundColor: "green", marginTop: "12px" }} onClick={handleSubmit}>{isLoading ? "Submitting..." : "Submit"}</Button>
            </form>
        </Box>
    )
}

export default EditProfile