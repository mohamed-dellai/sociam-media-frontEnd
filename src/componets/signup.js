import axios from 'axios';
import { useState} from 'react'
import thumb from '../thumbs-up-svgrepo-com.svg'
import error from '../db-error-svgrepo-com.svg'
import spinner from '../loading-svgrepo-com.svg'
import auth from '../globalstate.js/global.jsx'
import { proxy } from "valtio"
import { useNavigate } from 'react-router-dom';
export function SignUp() {
 const [stats,setStats] = useState("")
 const [res,setRes] = useState(false)
 let navigate=useNavigate()
 const snapshote= proxy(auth)

  const sendData=async ()=>{
    try{
        let data={
        email:document.getElementById("email").value,
        pass:document.getElementById("password").value
       }
        let respond=await axios.post("https://backendnodejssocialmedia.onrender.com/login",data)
        console.log(respond)
        if (respond.request.response==="{\"login\":\"succssefull\"}"){
           setStats(<img className="login-logos" alt="succssesfull"  src={thumb}></img>)
           snapshote.authen=true
           snapshote.email=data.email
           
           setTimeout(()=>navigate("/home"),1000)
           
        }
        else{
          setStats(<img className="login-logos" alt='error' src={error}></img>);
        }
    }
    catch(e){
      console.log(e)
      setStats(<img className="login-logos" alt="error"src={error}></img>)
    }
    setRes(false)
  }
  const submitAction=(e)=>
    {
      setRes(true)
      e.preventDefault();
      sendData()
  }

  const loading=<div className="spin login-logos"  ><img  alt='spinner' src={spinner}/></div>
 
  
    return (
    <div className="container1">
      
      <form id="form" action="" method="post" >
        
        <h3 style={{color: "black"}}>login</h3>
        
        <fieldset>
            <label htmlFor="phone" style={{color: "black"}}>Email address:</label>
            <input type="email" className='form-control' name="email" id="email" required/>
        </fieldset>
        <fieldset>
            <label htmlFor="phone" style={{color: "black"}}>Password:</label>
            <input type="password" className='form-control' name="password" id="password" required/>
        </fieldset>
        <fieldset>
          <button name="submit" type="button" className="bt1" id="submit"  onClick={submitAction}>submit</button>
          {stats}
          {res? loading : ""}
        </fieldset>
       
        <p className="copyright" style={{color: "black"}}>Don't have an account? <a style={{color: "#0d6efd"}} href="/signin">signup</a></p>
        <p className="copyright" style={{marginTop: "10px"}}><a href="/" style={{color: "#0d6efd"}} >forgot password?</a></p>
      </form>
      
    </div>
    );
  }