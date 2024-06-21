import './App.css'
import Navbar from './components/Navbar'
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";
import Home from './pages/Home';
import Page404 from './pages/Page404';
import Profile from './pages/Profile';
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import Login from './pages/Login';
import Signup from './pages/Signup';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

const getRouter = () =>{
  const user = useSelector(state => state.auth.user);
  return createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route  path='/' element={user.name ? <Home user/> : <Navigate to={"/login"}/>} />
        <Route  path='/profile/:userId' element={user.name ? <Profile owner="true" /> : <Navigate to={"/login"}/>} />
        <Route  path='/login' element={user.name ? <Navigate to={"/"}/> : <Login />} />
        <Route  path='/signup' element={user.name ? <Navigate to={"/"}/> : <Signup />} />
        <Route  path='*' element={<Page404 />} />
      </>
    )
  )
}


function App() {
  const queryClient = new QueryClient();

  useEffect(()=>{
    TimeAgo.addDefaultLocale(en)
  },[])

  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={getRouter()} />
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    </div>
  )
}

export default App
