import { Box, CircularProgress, Typography } from '@mui/material'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import make_request from '../axios'
import Navbar from '../components/Navbar'
import ProfileCard from '../components/ProfileCard'
import SocialCard from '../components/SocialCard'

const Home = () => {
  const [posts , setPosts] = useState([]);
  const [toFollowUser, setToFollowUser] = useState([]);
  const user = useSelector(state => state.auth.user); //this is the user object

  // query for fetching the user's newsfeed
  const {data , isFetching:isFetchingPosts} = useQuery(["loadUserPosts"] , async()=>{
    let res = await make_request(user.token).get(`/api/posts/feed/${user._id}`);
    return res.data
  }  , {
    onSuccess:(res)=>{
      setPosts(res)
      console.log(res);
      
    },
    refetchOnWindowFocus:false
  });

  // query for fetching all the user present in the database
  const {data:ToFollowUser , isFetching:isFetchingFollowUser} = useQuery(["loadToFollowUser"] , async()=>{
    let res = await make_request(user.token).get(`/api/user/?limit=5`);
    return res.data
  }  , {
    onSuccess:(res)=>{
      let filteredUser = res.filter((value)=>value._id != user.following.filter((n)=>n==value._id) && value._id !== user._id);
      setToFollowUser(filteredUser);
      // console.log(filteredUser);
      
    },
    refetchOnWindowFocus:false
  });


  return (
    <Box>
      <Navbar />
      <Box component={"div"} sx={{ display: 'flex', gap: '22px', marginTop: "62px" }}>
        <Box sx={{ flex: 2, height: '100vh', overflowY: 'scroll' }}>
          {/* wrapper box */}
          <Box sx={{ display: 'flex', flexDirection: "column" }}>
            {/* title container */}
            <Box sx={{ padding: "12px" }}>
              <Typography component={"h2"} sx={{ color: 'gray', fontSize: '25px', marginLeft: "42px" }}>Posts</Typography>
            </Box>
            {/* posts container */}
            <Box sx={{ bgcolor: "#E6E6E6", padding: "12px", display: 'flex', flexDirection: 'column', alignItems: "center", gap: "22px" }}>
              {/* cards coming.. */}
              {
                isFetchingPosts ? <CircularProgress/> : posts.length ?
                posts.map((post , index)=>(
                  <SocialCard width="90%" key={index} post={post} home />
                )) : "Follow Users to see their posts!!"
              }
            </Box>
          </Box>
        </Box>
        {/* Followers or Following box below */}
        <Box sx={{ flex: 1, marginTop: "22px", display: { xs: 'none', sm: 'none', md: 'block' } }} >
          {/* wrapper box */}
          <Box sx={{ padding: "22px", display: 'flex', flexDirection: 'column' }}>
            {/* header box */}
            <Box>
              <Typography component={"h2"} sx={{ color: 'gray', fontSize: '25px', marginLeft: "42px" }}>Who to follow</Typography>
            </Box>
            {/* content box */}
            <Box sx={{ marginTop: '22px' }}>
              {
                toFollowUser && toFollowUser.map((user , index)=>(
                  <Link to={`/profile/${user._id}`} style={{textDecoration:"none",color:"black"}}>
                    <ProfileCard key={index} name={user.name} id={user._id}/>
                  </Link>
                ))
              }
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default Home