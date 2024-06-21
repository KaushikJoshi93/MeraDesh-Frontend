import { Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query';
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

const EditPost = (props) => {
    const user = useSelector(state => state.auth.user); //this is the user object
    const [values , setValues] = useState("");
    const queryClient = useQueryClient();

    // function to fetch details of the specific post
    const {data , isLoading , isSuccess} = useQuery("loadCaption" , async()=>{
        let res = await make_request(user.token).get(`/api/posts/${props.postId}`);
        return res.data
    } , {
        onSuccess:(res)=>{
            setValues(res.text)
        },
        refetchOnWindowFocus:false
    })

    // mutation function for updating the post details
    const {mutate , isLoading:isUpdating} = useMutation(async()=>{
        let res = await make_request(user.token).put(`/api/posts/${props.postId}`,{
            text:values
        });
        return res.data
    } , {
        onSuccess:()=>{
            toast.success("Successfully!! Updated Post", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                });
            setValues("")
            queryClient.invalidateQueries("loadPosts")
        }
    })

    const handleSubmit = ()=>{
        mutate();
    }
   

  return (
    <Box sx={style}>
        {/* wrapper box */}
        <Box sx={{display:'flex' ,flexDirection:'column', alignItems:'center'}}>
            {/* Title  */}
            <Typography sx={{ color: "orangered", fontSize: "22px" }}>Edit Post</Typography>
            {/* content*/}
            <form  style={{ display: "flex", alignItems: "flex-start", flexDirection: "column", width: "100%", gap: "19px" }}>
                 {/* name field */}
                 <TextField id="standard-basic" label="Caption" variant="standard" style={{ width: "100%" }} type="text" value={values} onChange={(e)=>setValues(e.target.value)} />
                 {/* submit button */}
                <Button variant="contained" style={{ backgroundColor: "green", marginTop: "12px" }} onClick={handleSubmit}>{isUpdating ? "Updating...." : "Update"}</Button>
            </form>
        </Box>
    </Box>
  )
}

export default EditPost