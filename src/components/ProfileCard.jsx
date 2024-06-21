import { Avatar, Box, Button, Typography } from '@mui/material'
import React from 'react'

const ProfileCard = (props) => {
  
  return (
    <Box sx={{display:'flex' ,padding:'12px',alignItems:'center' , flexDirection: props.button && "column" , border:props.button && "1px solid black" , borderRadius:props.button && "12px" , background:props.button && "#22d9848a" , color:props.button && "black" }} >
        <Avatar alt='user' src={props.id ? `${import.meta.env.VITE_BACKEND_URL}/api/user/photo/${props.id}` : ""} sx={{flex:'1' , cursor:'pointer' }}/>
        <Typography sx={{flex: props.button ? '1' : '4',marginLeft:'12px'}}>{props.name ? props.name.toUpperCase() : "John Doe"}</Typography> 
        {!props.button && <Button variant="contained" href="#outlined-buttons" color="success" style={{flex:'1'}}>
        Follow
      </Button>}
    </Box>
  )
}

export default ProfileCard