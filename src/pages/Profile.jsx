import { Avatar, Box, Button, CircularProgress, Divider, Modal, Tab, Tabs, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react';
import ProfileCard from '../components/ProfileCard';
import SocialCard from '../components/SocialCard';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProfile from '../components/EditProfile';
import NewPost from '../components/NewPost';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios'
import Navbar from '../components/Navbar';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import  { userRequest } from '../axios.js'
import { ToastContainer } from 'react-toastify';

const Profile = (props) => {
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [posts , setPosts] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const local_user = useSelector(state => state.auth.user); //this is the user object
  const [user, setUser] = useState(local_user);
  const params = useParams();
  const queryClient = useQueryClient();


  // request for loading the user details
  const { data: userData, isFetched, refetch } = useQuery(["loadUser"], async () => {
    let response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/${params.userId}`, {
      headers: {
        Authorization: 'Bearer ' + local_user.token //the token is a variable which holds the token
      }
    });

    return response.data;
  }, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    onSuccess: (res) => {
      setUser(res);
      
    }
  });

  // request for loading the user post
  const {data: userPost , refetch:refetchPost , isFetching:isFetchingPost} = useQuery(["loadPosts"] , async()=>{
    let res = await userRequest.get(`/api/posts/by/${params.userId}`)
    setPosts(res.data);
    return res.data
  } , {
    refetchOnWindowFocus:false,
    refetchOnMount:true,
    
  })

  useEffect(()=>{
    const fetchData = async()=> await refetch();
    const fetchPosts = async()=>await refetchPost();
    fetchData();
    fetchPosts();
  } , [params.userId])


// request for following user
  const { mutate, isSuccess: isFollowed } = useMutation(() => {
    axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/follow`, { userId: local_user._id, followId: params.userId }, {
      headers: {
        Authorization: 'Bearer ' + local_user.token //the token is a variable which holds the token
      }
    }).then((response) => response.data);
  }, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['loadUser'])
      await refetch()
    }
  });

  // request for unfollowing user
  const { mutate: unfollow, isSuccess: isUnFollowed } = useMutation(() => {
    axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/user/profile/unfollow`, { userId: local_user._id, unfollowId: params.userId }, {
      headers: {
        Authorization: 'Bearer ' + local_user.token //the token is a variable which holds the token
      }
    }).then((response) => response.data);
  }, {
    onSuccess: async (data) => {
      await queryClient.invalidateQueries(['loadUser'])
      await refetch();
    }
  });

  const handleFollow = () => {
    mutate();
  }
  const handleUnFollow = () => {
    unfollow();
  }

  const checkFollowers = (userId) => {
    for (let obj in user.followers) {
      for (let key in user.followers[obj]) {
        if (user.followers[obj][key] == userId)
          return true;
      }
    }
    return false;
  }



  const handleChange = (event, newValue) => {
    let older_element = document.querySelector(`div[data-index='${value}']`);
    older_element.style.display = 'none';
    setValue(newValue);
    let target = document.querySelector(`div[data-index='${newValue}'`);
    target.style.display = 'flex';
    // target.style.flexDirection = {sm:'column',md:"row"}
    // target.style.flexDirection = "column"
  };
  return (
    <Box>
      <Navbar />
      <ToastContainer/>
      <Box component={"div"} sx={{ display: 'flex', gap: '22px', marginTop: "82px", marginLeft: "10%", justifyContent: 'flex-start', width: '80%' }}>
        {/* wrapper box */}
        <Box sx={{ width: "100%" }}>
          {/* title box */}
          <Box>
            <Typography sx={{ color: 'orangered', fontSize: 29 }}>Profile</Typography>
          </Box>
          {/* profile card */}
          <Box sx={{ display: 'flex', justifyContent: "flex-start", width: "100%", padding: "4px" }}>
            <Box sx={{ marginRight: "5%" }}>
            <Avatar sx={{ width: "70px", height: '70px' }} src={user.photo ? import.meta.env.VITE_BACKEND_URL+`/api/user/photo/${user._id}` : ""}/>
            </Box>
            <Box sx={{ width: "50%", display: 'flex', alignItems: 'center' }}>
              {user.name ? <Typography sx={{ fontSize: '22px' }}>{user.name.toUpperCase()}</Typography> : <Typography sx={{ fontSize: '22px' }}>Loading....</Typography>}
            </Box>
            <Box sx={{ display: 'flex', gap: '22px' }}>
              {params.userId == local_user._id ?
                <>
                  <EditIcon sx={{ color: 'green', cursor: 'pointer' }} onClick={handleOpen} />
                  <DeleteIcon sx={{ color: 'orangered', cursor: 'pointer' }} />
                </>
                :
                (user.followers && checkFollowers(local_user._id)) ?
                  <Button variant='contained' sx={{ bgcolor: 'orangered', ':hover': { bgcolor: 'red', color: 'black' } }} onClick={handleUnFollow}>Unfollow</Button>
                  :
                  <Button variant='contained' sx={{ bgcolor: 'green', ':hover': { bgcolor: 'greenyellow', color: 'black' } }} onClick={handleFollow}>Follow</Button>}
            </Box>
          </Box>
          {/* divider for the profile */}
          <Divider sx={{ width: "60%", marginTop: "19px" }} />

          {/* followers , following and post counter section */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', width: { xs: '80%', sm: '80%', md: '40%' }, padding: '8px', fontSize: { xs: '12px', sm: '12px', md: '18px' } }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Typography sx={{ fontSize: { xs: '12px', sm: '12px', md: '18px' }, fontWeight: '800' }}>0</Typography>
              <Typography sx={{ fontSize: { xs: '12px', sm: '12px', md: '18px' } }}>Posts</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Typography sx={{ fontSize: { xs: '12px', sm: '12px', md: '18px' }, fontWeight: '800' }}>
                {user.followers ? user.followers.length : 0}
              </Typography>
              <Typography sx={{ fontSize: { xs: '12px', sm: '12px', md: '18px' } }}>Followers</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Typography sx={{ fontSize: { xs: '12px', sm: '12px', md: '18px' }, fontWeight: '800' }}>
                {user.following ? user.following.length : 0}
              </Typography>
              <Typography sx={{ fontSize: { xs: '12px', sm: '12px', md: '18px' } }}>Following</Typography>
            </Box>
          </Box>
          {/* divider for the profile */}
          <Divider sx={{ width: "60%", marginTop: "19px" }} />
          {/* about section of profile */}
          <Box sx={{ marginTop: "20px" }}>
            <Typography sx={{ fontSize: '16px' }}>{user.about != "" ? user.about : "Amazing Programmer"}</Typography>
            <Typography sx={{ color: "gray", fontSize: "12px" }}>Joined: Mon Sep 04 2017</Typography>
          </Box>
          {/* divider for the profile */}
          <Divider sx={{ width: "60%", marginTop: "19px" }} />
          {/* tabs */}
          <Box sx={{ width: { xs: '100%', sm: '100%', md: '80%' }, display: 'flex', flexDirection: 'column' }}>
            {/* tabs for the content */}
            <Tabs value={value} onChange={handleChange} centered sx={{ color: "greenyellow", bgcolor: '#76717140', width: "100%", display: 'flex', justifyContent: 'flex-start', boxShadow: "8px 15px 23px -4px rgba(102,95,102,1)", borderRadius: "4px" }} >
              <Tab label="Posts" sx={{ flex: 1, fontSize: { xs: '10px', sm: '14px', md: '16px' } }} />
              <Tab label="Followers" sx={{ flex: 1, fontSize: { xs: '10px', sm: '14px', md: '16px' } }} />
              <Tab label="Following" sx={{ flex: 1, fontSize: { xs: '10px', sm: '14px', md: '16px' } }} />
            </Tabs>
            {/* actual content according to tab */}
            <Box sx={{ display: 'flex', width: "100%", padding: '8px' }}>
              <Box sx={{ width: "100%", display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '9px', gap: "22px" }} data-index="0">
                {local_user._id == user._id && <NewPost user={local_user}/>}
                {
                  !isFetchingPost ? posts.length ? posts.map((post , index)=>{
                   return  <SocialCard width="90%" key={index} post={post} avatar = {user.photo ? import.meta.env.VITE_BACKEND_URL+`/api/user/photo/${user._id}` : ""} />
                  }) : "No posts Yet!!"
                  : <CircularProgress/>
                }
              </Box>
              {/* followers box */}
              <Box sx={{ width: "100%", display: 'none', flexWrap: 'wrap', justifyContent: 'flex-start',flexDirection:{sm:"column",md:'row'} ,gap:5,marginTop:5 }}  data-index="1">
                {
                  user.followers.length ? user.followers.map((item, index) => {
                    return (
                    <Link to={'/profile/'+item._id} style={{textDecoration:"none"}}>
                      <ProfileCard button="false" name={item.name} key={index} id={item._id}/>
                    </Link>
                    )
                  }) : <Typography sx={{ fontSize: '22px' }}>No Followers</Typography>

                }
              </Box>
              {/* following box */}
              <Box sx={{ width: "100%", display: 'none', flexWrap: 'wrap', justifyContent: 'flex-start' , gap:"22px",flexDirection:{sm:"column",md:"row"},marginTop:5 }} data-index="2">
                {
                  user.following.length ? user.following.map((item, index) => {
                    return (
                      <Link to={'/profile/'+item._id} style={{textDecoration:"none"}}>
                        <ProfileCard button="false" name={item.name} key={index} id={item._id}/>
                      </Link>
                      )
                  }) : <Typography sx={{ fontSize: '22px' }}>No Following</Typography>

                }

              </Box>
            </Box>
          </Box>

          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <EditProfile />
          </Modal>

        </Box>
      </Box>
    </Box>
  )
}

export default Profile