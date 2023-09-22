import axios from "axios"
import { useState } from "react"
import { useEffect } from "react"
import { useLayoutEffect } from "react"
import {proxy} from "valtio"
import auth from '../globalstate.js/global.jsx'
import back from '../back.svg'
export function Messages(){
  const snapshot=proxy(auth)
    const[users,setUsers]=useState([])
    const[currentFriend,setCurrentFriend]=useState({name: "Messenger" , email:"none" , photo: ""})
    const[currentMessages,setCuurrentMessages]=useState([])
     const getAllUsers=async()=>{
        try{
            const result=await axios.get(`https://backendnodejssocialmedia.onrender.com/allUsers?email=${snapshot.email}`)
            setUsers(result.data)
        }
        catch(e){
            console.log(e)
        }
     }
     useEffect(()=>{
         getAllUsers()
    },[])

   
    useLayoutEffect(() => {
      var myDiv = document.getElementById("scroll");
      var divHeight = myDiv.scrollHeight;
      myDiv.scrollTop = divHeight;

    }, [currentMessages]);
    const bringMessages=async (id)=>{
      
      try{
        const result=await axios.get(`https://backendnodejssocialmedia.onrender.com/messenger?r=${snapshot.email}&r1=${id}`)
        setCuurrentMessages(result.data)
      }
      catch(e){
        console.log(e)
      }
    }
    function formatDate(sqlDate) {
      // Convert the SQL date string to a JavaScript Date object
      var date = new Date(sqlDate);
      // Get the current date
      var currentDate = new Date();
    
      // Check if the date is today
      if (date.toDateString() === currentDate.toDateString()) {
        // If the date is today, return the hours and minutes
        return date.toLocaleString('default', { hour: 'numeric', minute: 'numeric' });
      } else if (date.getFullYear() === currentDate.getFullYear() && date.getMonth() === currentDate.getMonth()) {
        // If the date is this month, return the day, hours and minutes
        return date.toLocaleString('default', { day: 'numeric', hour: 'numeric', minute: 'numeric' });
      }else if (date.getFullYear() === currentDate.getFullYear()) {
        // If the date is this year, return the month, day, hours and minutes
        return date.toLocaleString('default', { month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' });
      } else {
        // Get the month as a string (e.g. "January")
        var month = date.toLocaleString('default', { month: 'long' });
        // Get the day of the month (e.g. "18")
        var day = date.getDate();
        // Get the year (e.g. "2023")
        var year = date.getFullYear();
        // Return a new string in the format "Month day, year"
        return month + ' ' + day + ', ' + year;
      }
    }

  
    
    const handleUserClick=(e)=>{
     setCuurrentMessages([])
      var test=users.find((obj)=>{
        return obj.email===e.currentTarget.id
      })
      setCurrentFriend(test)
      bringMessages(e.currentTarget.id)
      if(document.getElementsByClassName("chatbox")[0].clientWidth===0){
        document.getElementsByClassName("chatbox")[0].style.display="block"
        document.getElementsByClassName("members")[0].style.display="none"
      }
    }
    const getTime=()=>{
      const time = new Date();
     
      return (`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
     }
    
    const sendMessage=async(e)=>{
      if(e.target.parentElement.children[0].value==="")
        return;
      const info={
        sender : snapshot.email,
        receiver: currentFriend.email,
        body: e.target.parentElement.children[0].value,
        date: getTime()
      }
      e.target.parentElement.children[0].value=""
      try{
      
        const result=await axios.post(`https://backendnodejssocialmedia.onrender.com/messenger`,info)
        console.log(result) 
        
      }
        
      catch(e){
        console.log(e)
      }
    }

    const deleteAll=async ()=>{
      const s=window.confirm("you sure")
      if(s){
        try{
          const res=await axios.delete(`https://backendnodejssocialmedia.onrender.com/messenger?r=${snapshot.email}&r1=${currentFriend.email}`)
          console.log(res)
          bringMessages(currentFriend.email)
        }
        catch(e){
          console.log(e)
        }
      }
    }
    
    const getMessages2=async()=>{
      const list=document.getElementById("messageList").children;
      var data={}
    
      if( document.getElementById("messageList").children.length===0){
         data={
          sender: snapshot.email,
          receiver: currentFriend.email,
          length: 0
        }
      }
        else{
          data={
            sender: snapshot.email,
            receiver: currentFriend.email,
            length: list[list.length-1].id
          }
        }
      
      try{
        const result=await axios.post(`https://backendnodejssocialmedia.onrender.com/messenger2`,data)
        if(result.data.length>0)
        setCuurrentMessages([...currentMessages,...result.data])
      }
      catch(e){
        console.log(e)
      }
    }
    useEffect(()=>{
      const i=setInterval(()=>{getMessages2()}  ,500)
      return(
        ()=>clearInterval(i)
      )
    })

    const returnToChatList=(e)=>{
      document.getElementsByClassName("chatbox")[0].style.display="none"
      document.getElementsByClassName("members")[0].style.display="block"
    }
    const search=(e)=>{
      let word=e.target.value
      let parent=document.getElementsByClassName('chat-list')[0].children
      
      let div;
      for(let i=0;i<parent.length;i++){
        div=parent[i]
        if(div.children[1].children[0].innerHTML.includes(word))
          {
            
            div.classList.remove("hide")
          }
        else
        div.classList.add("hide")
      
    }
    }
    const handleEmojiClick = emojie => {
          document.getElementById("this").value=document.getElementById("this").value+emojie
          const pick=document.getElementById('emojiePicker')
          pick.style.opacity=0
          pick.style.display="none"
    }
    const emojieHandle=(e)=>{
      const pick=document.getElementById('emojiePicker')
      pick.style.display="block"
      pick.style.left=`${e.target.offsetLeft-50}px`
      pick.style.top=`${e.target.offsetTop-150}px`
      pick.style.opacity=1
  }
  
  const t=<div id="emojiePicker" style={{position: "absolute",display: "none"}}>
  <button onClick={() => handleEmojiClick('😄')}>😄</button>
  <button onClick={() => handleEmojiClick('😎')}>😎</button>
  <button onClick={() => handleEmojiClick('😍')}>😍</button>
  <button onClick={() => handleEmojiClick('🤔')}>🤔</button>
  <button onClick={() => handleEmojiClick('😴')}>😴</button>
  <button onClick={() => handleEmojiClick('🤗')}>🤗</button>
  <button onClick={() => handleEmojiClick('😠')}>😠</button>
  <button onClick={() => handleEmojiClick('😷')}>😷</button>
  <button onClick={() => handleEmojiClick('😜')}>😜</button>
  <button onClick={() => handleEmojiClick('😇')}>😇</button>
  <button onClick={() => handleEmojiClick('😻')}>😻</button>
  <button onClick={() => handleEmojiClick('🙏')}>🙏</button>
  <button onClick={() => handleEmojiClick('🤝')}>🤝</button>
  <button onClick={() => handleEmojiClick('🤡')}>🤡</button>
  <button onClick={() => handleEmojiClick('🤑')}>🤑</button>
  <button onClick={() => handleEmojiClick('🤮')}>🤮</button>
</div>
    return(
<div className="messa">
      
  <div className="members">
    <div className='all-users'>
    <div className="chatlist">
            <div className="modal-dialog-scrollable">
              <div className="modal-content">
                <div className="chat-header">
                  <div className="msg-search">
                    <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search" onChange={search}/>
                    
                  </div>

                  <ul className="nav nav-tabs" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active" id="Open-tab" data-bs-toggle="tab" data-bs-target="#Open" type="button" role="tab" aria-controls="Open" aria-selected="true">Open</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="Closed-tab" data-bs-toggle="tab" data-bs-target="#Closed" type="button" role="tab" aria-controls="Closed" aria-selected="false">Closed</button>
                    </li>
                  </ul>
                </div>

                <div className="modal-body">
                  
                  <div className="chat-lists">
                    <div className="tab-content" id="myTabContent">
                      <div className="tab-pane fade show active" id="Open" role="tabpanel" aria-labelledby="Open-tab">
                        
                          
                        
                        <div className="chat-list">
                          {users.map((user,index)=>{
                            return(
                              <a key={index} href="#" onClick={handleUserClick} className="d-flex align-items-center" id={user.email}>
                              <div className="flex-shrink-0">
                                <img className="img-fluid" src={user.photo} alt="user img"/>
                                <span className="active"></span>
                              </div>
                              <div className="flex-grow-1 ms-3">
                                <h3>{user.name}</h3>
                                <p>{user.description}</p>
                              </div>
                            </a>
                            )
                          })}
                          
                         

                        </div>
                        
                      </div>
                      <div className="tab-pane fade" id="Closed" role="tabpanel" aria-labelledby="Closed-tab">

                        
                        <div className="chat-list">
                          

                        </div>
                        
                      </div>
                    </div>

                  </div>
                  
                </div>
              </div>
            </div>
          </div>
     
      
    </div>
    
  </div>
  <div className="chatbox">
              <img src={back} alt="return" id="hide" style={{width:'30px',marginBottom:"15px"}} onClick={returnToChatList}></img>
              <div className="modal-content mo">
                <div className="msg-head">
                  <div className="row">
                    <div className="col-8">
                      <div className="d-flex align-items-center">
                        <span className="chat-icon"><img className="img-fluid" src="https://mehedihtml.com/chatbox/assets/img/arroleftt.svg" alt="title"/></span>
                        <div className="flex-shrink-0">
                          <img className="img-fluid" src={currentFriend.photo} alt="user img"/>
                        </div>
                        <div className="flex-grow-1 ms-3">
                          <h3>{currentFriend.name}</h3>
                          <p>{currentFriend.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-4">
                      <ul className="moreoption">
                        <li className="navbar nav-item dropdown">
                          <div className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fa fa-ellipsis-v" aria-hidden="true"></i></div>
                          <ul className="dropdown-menu">
                            <li onClick={deleteAll}><div className="dropdown-item" >Delete messages</div></li>
                           
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="modal-body" id="scroll">
                  <div className="msg-body">
                    <ul id="messageList">
                      {
                      
                      currentMessages.map((obj,ndex)=>{
                        if(obj.sender!==snapshot.email)
                        return(
                          <li className="sender" key={ndex} id={obj.id}>
                            <p>{obj.body}</p>
                            <span className="time">{formatDate(obj.date) }</span>
                          </li>
                        )
                        else
                         return(
                          <li className="repaly" key={ndex} id={obj.id}>
                            <p>{obj.body}</p>
                            <span className="time">{formatDate(obj.date) }</span>
                          </li>
                         )
                      })
                      
                      }
                      
                      

                    </ul>
                  </div>
                </div>

                <div className="send-box">
                  <form action="">
                    <input type="text"  id="this" className="form-control" aria-label="message…" placeholder="Write message…" />

                    <button type="button" onClick={sendMessage}><i className="fa fa-paper-plane" aria-hidden="true"></i> Send</button>
                  </form>

                  <div className="send-btns">
                    <div className="attach">
                      <select className="form-control" id="exampleFormControlSelect1">
                        <option>Select template</option>
                        <option>Template 1</option>
                        <option>Template 2</option>
                      </select>
                      {t}
                      <div className="add-apoint form-control" onClick={emojieHandle} id="add" style={{cursor:"pointer"}}>
                        
                        <div href="#" data-toggle="modal" data-target="#exampleModal4"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M8 16C3.58862 16 0 12.4114 0 8C0 3.58862 3.58862 0 8 0C12.4114 0 16 3.58862 16 8C16 12.4114 12.4114 16 8 16ZM8 1C4.14001 1 1 4.14001 1 8C1 11.86 4.14001 15 8 15C11.86 15 15 11.86 15 8C15 4.14001 11.86 1 8 1Z" fill="#7D7D7D" />
                            <path d="M11.5 8.5H4.5C4.224 8.5 4 8.276 4 8C4 7.724 4.224 7.5 4.5 7.5H11.5C11.776 7.5 12 7.724 12 8C12 8.276 11.776 8.5 11.5 8.5Z" fill="#7D7D7D" />
                            <path d="M8 12C7.724 12 7.5 11.776 7.5 11.5V4.5C7.5 4.224 7.724 4 8 4C8.276 4 8.5 4.224 8.5 4.5V11.5C8.5 11.776 8.276 12 8 12Z" fill="#7D7D7D" />
                          </svg>Emojie</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>         
        

   
    
    )
}