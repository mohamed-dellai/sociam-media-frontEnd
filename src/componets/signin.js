import axios from "axios"
import { useState } from "react"


import { useNavigate } from "react-router-dom"
export function SignIn(){
  
   const [message,setMessage]=useState('')
   let navigate=useNavigate()
   
   const send=async ()=>{
    try{
        const data={
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            passwordC: document.getElementById('confirm_password').value
        }
        if(data.password!==data.passwordC){
          document.getElementById('confirm_password').style.borderColor="red"
          return;
        }
        const respond= await axios.post("https://backendnodejssocialmedia.onrender.com/signin",data)
       
        
        if(respond.request.responseText==="{\"error\":\"exist\"}"){
  
              setMessage("User already exist please try again ")
              
        }
        else if(respond.request.responseText==="{\"error\":\"false\"}"){
          setMessage("signIn succssefully you can logIn")

          setTimeout(()=>navigate("/home"),1300)
        }
        else{
          setMessage("Server Error ")
        }

    }
    catch(e){
      console.log(e)
    }
}
    return(
        
    <div className="container1">
     
      <form id="form" action="" method="" >
       
        <h3>signup</h3>
        
        <fieldset>
          <label htmlFor="name">Your name:</label>
          <input className='form-control' type="text" id="name" tabIndex="1" required/>
        </fieldset>
        <fieldset>
            <label htmlFor="email">Email address:</label>
            <input className='form-control' type="email" id="email" required/>
        </fieldset>
        <fieldset>
            <label htmlFor="password">Password:</label>
            <input className='form-control' type="password" name="password" id="password" required/>
        </fieldset>
        <fieldset>
            <label htmlFor="verifie">Confirm password:</label>
            <input className='form-control' type="password" name="confirm_password" id="confirm_password" required/>
        </fieldset>
        <fieldset>
          <button name="submit" type="button" onClick={send}id="submit">submit</button>
          <p style={{textAlign: "center" , color:"red",fontSize:"15px"}}>{message}</p>
        </fieldset>
        
        <p className="copyright">Already have an account? <a href="/">login</a></p>
        
      </form>
      </div>

    )

}