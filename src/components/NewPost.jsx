import { Avatar, Box, Button, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CancelIcon from '@mui/icons-material/Cancel';
import { Carousel } from 'react-responsive-carousel';
import { useMutation, useQueryClient } from 'react-query';
import make_request from '../axios.js';
import { toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';


const NewPost = ({user}) => {
    const [postFile, setPostFile] = useState([]);
    const [caption, setCaption] = useState("");
    const [imgCount, setImgCount] = useState(-1);
    const queryClient = useQueryClient();
    const handleSubmit = async()=>{
        let postData = new FormData();
        caption!="" && postData.append("text",caption)
        if(postFile.length){
            for(let i in postFile){
                postData.append(`photo[${i}]`,postFile[i])
            }
        }
       
        console.log(postData.get("text"))
        console.log(postData.get("photo[0]"))
        console.log(postData.get("photo[1]"))
        // console.log(postData.get("photo[]"));
        // console.log(postFile);
        
        
        
        let result = await make_request(user.token).post(`/api/posts`, postData);
        console.log(result.data);
        return result.data;
    }
    const { mutate:makePost, isSuccess: isPosted , isLoading } = useMutation(handleSubmit, {
        onSuccess: async(data) => {
          console.log('data fetched...');
          toast.success("Successfully!! Posted", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
            });
          setCaption("");
          setPostFile([]);
          setImgCount(-1);
          await queryClient.invalidateQueries(['loadPosts']);
          
        }
      });
      
    return (
        <Box sx={{ width: "100%" ,border:'0.5px solid gray'}}>
            {/* wrapper box */}
            <form sx={{ display: 'flex', flexDirection: 'column', gap: '22px', border: "0.01px solid #dbd2d2" }} encType="multipart/form-data" onSubmit={(e) => { e.preventDefault() }}>
                {/* post header */}
                <Box sx={{ display: 'flex', gap: '22px', alignItems: 'center', padding: '12px', bgcolor: '#63b0ff' }}>
                    <Avatar src={user.name ? import.meta.env.VITE_BACKEND_URL+`/api/user/photo/${user._id}` : ""} />
                    {user.name ? <Typography >{user.name}</Typography>:<Typography >John Doe</Typography>}
                </Box>
                {/* image box */}
                {postFile.length ? <Box sx={{ padding: '4px', display: 'flex', justifyContent: 'center', border: '2px solid black', bgcolor: '#649bb54a' }}>
                    {postFile.length == 1 ? <img src={postFile[0] ? URL.createObjectURL(postFile[0]) : ""} hidden={postFile[0] ? false : true} style={{ border: "0.01px solid #dbd2d2", width: "80%", height: "80%" }} /> :
                        postFile.length > 1 &&
                        <Carousel showThumbs={false} selectedItem={imgCount} >
                            {postFile.map((file, index) => (
                                <Box sx={{ width: "100%", height: "100%", display: 'flex', justifyContent: 'center' }} key={index}>
                                    <img src={URL.createObjectURL(file)} style={{ border: "0.01px solid #dbd2d2", width: "80%", height: "80%" }} />
                                </Box>
                            ))}
                        </Carousel>
                    }
                    <CancelIcon onClick={() => { setPostFile([]); setImgCount(-1) }} sx={{ cursor: "pointer", display: postFile ? "block" : "none" }} />
                </Box> : null}
                {/* Add more button box */}
                {postFile.length ? <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Button variant='contained' sx={{ cursor: 'pointer' }} onClick={() => document.querySelector("#postFile").click()}>Add more</Button>
                </Box> : null}
                {/* post content box */}
                <Box>
                    <Box sx={{ display: "flex", flexDirection: 'column', gap: "12px", padding: "12px" }}>
                        <TextField type={'text'} placeholder="Share thoughts.." value={caption} onChange={(e) => setCaption(e.target.value)} />
                        <input type={"file"} id="postFile" hidden onChange={(e) => { e.target.files.length && setPostFile([...postFile, e.target.files[0]]); let count = imgCount; setImgCount(++count) }}  />
                        <label htmlFor='postFile'>
                            <CameraAltIcon sx={{ marginLeft: "12px", color: 'orangered', cursor: 'pointer' }} />
                        </label>
                    </Box>
                </Box>
                {/* post button box */}
                <Box sx={{ bgcolor: '#4d89d36b', padding: "12px" }}>
                    <Button variant='contained' disabled={postFile.length || caption.length ? false : true} onClick={makePost}type="submit">{isLoading ? "Posting...." : "POST"}</Button>
                </Box>
            </form>
        </Box>
    )
}

export default NewPost