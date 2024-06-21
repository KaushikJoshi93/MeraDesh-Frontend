import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIconFilled from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import CommentIcon from '@mui/icons-material/Comment';
import Box from '@mui/material/Box';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { useMutation, useQueryClient } from 'react-query';
import { useSelector } from 'react-redux';
import make_request from '../axios';
import { toast } from 'react-toastify';
import TimeAgo from 'javascript-time-ago'
import { useEffect } from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import EditPost from './EditPost';
import { Modal } from '@mui/material';


const ReadmoreCreator = ({ text, showText, setShowText }) => {
    return (
        <>
            <Typography style={{ transitionProperty: "all", transitionDuration: "0.1", marginBottom: "22px" }} variant="body2" color="text.secondary">
                {text.substring(0, 150)}{showText ? text.substring(150, text.length) : text.length > 150 && "..."}
            </Typography>
            {text.length > 150 && <a onClick={() => setShowText(!showText)} style={{ cursor: "pointer", marginTop: "22px", backgroundColor: "gray", padding: "5px", color: "white" }}>{showText ? "See less" : "See more"}</a>}
        </>
    )
};




export default function SocialCard(props) {
    const [showText, setShowText] = React.useState(false);
    const [like, setLike] = React.useState(props.post.likes.length);
    const [showModal, setShowModal] = useState(false);
    const user = useSelector(state => state.auth.user); //this is the user object
    const queryClient = useQueryClient();
    const params = useParams();
    const [timeAgo, setTimeAgo] = useState(null);

    const text = props.post ? props.post.text : "hello";

    // mutation function for liking the post
    const { mutate: doLike, isLoading: isLiking, isSuccess: isLiked } = useMutation(async () => {
        let res = await make_request(user.token).put("/api/posts/like", {
            postId: props.post._id
        });
        return res.data;
    }, {
        onSuccess: async (res) => {
            setLike(res.likes.length)
            let result = await queryClient.invalidateQueries(!props.home ? ['loadPosts'] : ['loadUserPosts'])
            console.log(result);
            

        }
    })

    // mutation function for unliking the post
    const { mutate: doUnLike, isLoading: isUnLiking, isSuccess: isUnLiked } = useMutation(async () => {
        let res = await make_request(user.token).put("/api/posts/unlike", {
            postId: props.post._id
        });
        return res.data;
    }, {
        onSuccess: async (res) => {
            setLike(res.likes.length)
            let result = await queryClient.invalidateQueries(!props.home ? ['loadPosts'] : ['loadUserPosts']);
            console.log(result);
        }
    })

    // mutation function for removing the post
    const { mutate: removePost, isLoading: isRemoving, isSuccess: isRemoved } = useMutation(async () => {
        let res = await make_request(user.token).delete(`/api/posts/${props.post._id}`);
        return res.data;
    }, {
        onSuccess: async (res) => {
            let result = await queryClient.invalidateQueries(['loadPosts']);
            toast.success("Successfully Deleted Post!!", {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
            });

        }
    })

    // function for checking whether we have to like the post or unlike the post
    const handleLike = (e) => {
        let val = e.currentTarget.getAttribute("data-name");
        if (val == "borderLike") {
            doLike()
        }
        else if (val == "filledLike") {
            doUnLike()
        }
        else {
            console.log('invalid...');

        }

    };

    // function for handling removing of post
    const handlePostRemove = (e) => {
        let res = confirm("Are you sure you want to delete this post??");
        if (res) {
            removePost();
        }
    }

    // functin for handling updating of a post
    const handleEdit = () => {
        setShowModal(true)
    }

    useEffect(() => {
        setTimeAgo(new TimeAgo('en-US'))
    }, [])

    return (
        <Card sx={{
            maxWidth: props.width || "80%", border: "0.01px solid #dbd2d2", minWidth: props.width || "80%"
        }}>
            <CardHeader
                avatar={
                    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe" src={import.meta.env.VITE_BACKEND_URL+`/api/user/photo/${props.post.postedBy._id}`} />
                }

                title={props.post.postedBy.name}
                subheader={timeAgo ? timeAgo.format(new Date(props.post.createdAt)) : ""}
                action={
                    user._id == params.userId ?
                        <Box sx={{ display: 'flex', gap: '18px' }}>
                            <EditIcon sx={{ color: 'orangered', cursor: 'pointer' }} onClick={handleEdit} />
                            <DeleteIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={handlePostRemove} />
                        </Box> :
                        ""
                }
                sx={{ background: "#63b0ff" }}
            />
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <EditPost postId={props.post._id} />
            </Modal>
            {
                props.post.photo && <Carousel autoPlay={true} showThumbs={false} infiniteLoop={true}>

                    {props.post.photo.map((value, index) => (
                        <CardMedia
                            component="img"
                            height="194"
                            image={import.meta.env.VITE_BACKEND_URL + `/api/posts/photo/${props.post._id}/${index}`}
                            alt="Paella dish"
                        />))
                    }
                </Carousel>
            }

            <CardContent>
                {/* <Typography variant="body2" color="text.secondary"> */}
                <ReadmoreCreator text={text} showText={showText} setShowText={setShowText} />
                {/* </Typography> */}
            </CardContent>
            <CardActions style={{ display: 'flex', justifyContent: "space-between" }}>
                <Box>
                    <IconButton aria-label="add to favorites">
                        {
                            !(props.post.likes.find((value) => value == user._id)) ?
                                <FavoriteIcon sx={{ color: "red" }} onClick={handleLike} data-name="borderLike" /> :
                                <FavoriteIconFilled sx={{ color: "red" }} onClick={handleLike} data-name="filledLike" />

                        }
                        <Typography sx={{ fontSize: "12px" }}>{like}</Typography>
                    </IconButton>
                    <IconButton aria-label="share">
                        <CommentIcon sx={{ color: '#00abf1' }} />
                        <Typography sx={{ fontSize: "12px" }}>{props.post.comments.length}</Typography>
                    </IconButton>
                </Box>
                <Box>
                    <IconButton aria-label="comment" >
                        <ShareIcon />
                    </IconButton>
                </Box>

            </CardActions>


        </Card>
    );
}



