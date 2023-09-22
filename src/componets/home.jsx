import smile from '../smile-svgrepo-com.svg'
import auth from '../globalstate.js/global.jsx'
import { proxy } from "valtio"
import { useNavigate } from 'react-router-dom'
import heart from '../red-heart-icon.svg'
import up from '../image-up.svg'
import axios from 'axios'
import { useEffect,useState } from 'react'
import set from '../settings.svg'
import profileSet from '../profile.svg'
import logOut from '../log-out.svg'
import reload from '../reload-svgrepo-com.svg'
import messenger from '../messenger-svgrepo-com.svg' 
import React, { useRef } from "react";
export function Home(){
  const snapshot=proxy(auth)
  const [userName,setUserName]=useState("")
  const [emojieTextArea,setEmojieTextArea]=useState(null)
  const [post,setPosts]=useState([])
  const[showAlert,setShowAlert]=useState(false)
  const [imageSize,setImageSize]=useState("")
  const [postLoading,setPostLoading]=useState(false)
  const start=useRef(1000)
  const loading = useRef(1);

  const handleEmojiClick = emojie => {
    emojieTextArea.value=emojieTextArea.value+emojie
    setEmojieTextArea(null)
    const pick=document.getElementById('emojiePicker')
    pick.style.left=`0px`
    pick.style.top=`0px`
    pick.style.opacity=0
    
  }
  useEffect(() => {
    const handleScroll = () => {
      if(loading.current===-1)
        return;
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.offsetHeight;
      const scrollPosition = window.scrollY;
      
      if (windowHeight + scrollPosition >= fullHeight-10) {
       
        getPosts()
        
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  useEffect(()=>{
    document.getElementsByClassName("bigReload")[0].style.display="flex"
    getUser()
    getPosts()
  },[])
 
  const navigate=useNavigate()
  
  const sendLike=async (id,e)=>{
      const data={
        id:id,
        email:snapshot.email
      }
      
      try
      {
        const res =await axios.post("https://backendnodejssocialmedia.onrender.com/home/like",data)
        
        const text=e.target.parentElement.parentElement.children[2].children[1].innerHTML;
        var newT=text.substring(0,text.indexOf("l")).trim();
            
        if(res.data==="liked succsefully")
          {
            newT=parseInt(newT)+1
            e.target.parentElement.parentElement.children[2].children[1].innerHTML=` ${newT} likes`
          }
     }
      catch(e){
        console.log(e)
      }
  }
  const handleClick=(e)=>{
    
          sendLike(parseInt(e.target.parentElement.parentElement.id),e)
          e.target.parentElement.children[1].style.opacity="1"
          e.target.parentElement.children[1].style.width="100px"
          e.target.parentElement.children[1].style.zIndex="2"
          setTimeout(()=>{e.target.parentElement.children[1].style.opacity="0";e.target.parentElement.children[1].style.width="50px";e.target.parentElement.children[1].style.zIndex="-1"},500)

  }
  
  const getUser=async ()=>{
    try{
      const userInfo=await axios.get(`https://backendnodejssocialmedia.onrender.com/home:${snapshot.email}`)
      snapshot.photo=userInfo.data[0].photo
      snapshot.userName=userInfo.data[0].name
      setUserName(userInfo.data[0])
    }
    catch(e){
      console.log(e)
    }
  }  
  
  const getPosts=async ()=>
  {
    try
    {
            loading.current=-1
            document.getElementById("relo").style.display="block"
            const posts=await axios.get(`https://backendnodejssocialmedia.onrender.com/home?start=${start.current}`)
            console.log(posts.data)
            if(posts.data==="last"){
              document.getElementById("relo").style.display="none"  
              document.getElementsByClassName("bigReload")[0].style.display="none"
              console.log('test')
              return;
            }
           
            setPosts(prevPost => [...prevPost, ...posts.data]);
            start.current=parseInt(posts.data[0].id)-1 
            document.getElementById("relo").style.display="none"  
            document.getElementsByClassName("bigReload")[0].style.display="none"    
    }
  catch(e){
    console.log(e)
  }
   loading.current=1
   document.getElementsByClassName("bigReload")[0].style.display="none"
  }
  const deletePost=async(e)=>{
    var id=parseInt(e.currentTarget.parentElement.parentElement.parentElement.parentElement.id)
    console.log(id)
    try{
      const result= await axios.delete(`https://backendnodejssocialmedia.onrender.com/home:${id}`)
      if(result.data==="succ"){
        console.log("done")
        var filteredArray = post.filter(function(obj) {
          return obj.id != id;
        });
        setPosts(filteredArray)
      }
        
    }
    catch(e){
      console.log(e)
    }
  }
  const sendPost=async (date,e)=>{
    const data={value:e.target.result, email:snapshot.email, text:document.getElementById('share').value, date:date}
    try
    {const result=await axios.post("https://backendnodejssocialmedia.onrender.com/upload",data)
    
    if(result.data==="succsseful"){
        setImageSize("")
        getLastPost();
    }
    else{
      setImageSize("error uploading your post")
    }
  }
  catch(e){
    console.log(e)
    setImageSize("error uploading your post")
  }
  }
  const getLastPost=async()=>{
    try
    {
            const posts=await axios.get(`https://backendnodejssocialmedia.onrender.com/homeLast`)
            setPosts(prevPosts => [...posts.data , ...prevPosts, ]);
            
    }
  catch(e){
    console.log(e)
  }
    setPostLoading(false)
  }
  
  const logFile=(e)=>{
     let date=getTime()
     sendPost(date,e)
     document.getElementById('share').value=""
  }

  const handleFile=()=>{
    
    const element=document.getElementById("share")
    if(element.value===""){
      element.style.borderColor="red";
      element.placeholder="Write something"
      element.classList.add("red")
     return;
    }
    setPostLoading(true)
    let file=new Blob()
    element.style.borderColor="black";
    element.placeholder=`what's new ${userName.name}`
    element.classList.remove("red")
    const reader = new FileReader();
    if(document.getElementById("input-file").files.length>=1)
      {
        file=document.getElementById("input-file").files[0];
    }
    
    reader.onload = logFile;
    reader.readAsDataURL(file)
  }
 
 const getTime=()=>{
  const time = new Date();
 
  return (`${time.getFullYear()}-${time.getMonth()+1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`)
 }

  const sendComment=async (e)=>{
    let content=e.currentTarget.parentElement.children[1].value;
    
    e.currentTarget.parentElement.children[1].value=""
    if(content!==""){
    
    var id=e.currentTarget.parentElement.parentElement.parentElement.id
   
    
    let date=getTime()
    
    let data={
      value: content,
      date: date,
      email: snapshot.email,
      id: id 
    }
    try{
      await axios.put("https://backendnodejssocialmedia.onrender.com/comment",data);
      e.target.parentElement.parentElement.parentElement.children[3].click()
    }
    catch(e){
      console.log(e)
    }
    
  }
  }
  const handleReload=()=>{
    getPosts()
  }
  const loadComment=async(e)=>{
    e.target.parentElement.children[4].innerHTML=""
    let l=e.currentTarget.parentElement.children[4].children.length;
    
    let id=e.currentTarget.parentElement.id;
    try{
      const result=await axios.get(`https://backendnodejssocialmedia.onrender.com/comment?l=${l}&id=${id}`);
     
      if(!result)
       return;
      result.data.forEach(result => {
        
        var newElem=document.createElement("div");
        newElem.classList.add("theCom");
        let image=document.createElement("img");
        image.src=result.photo
        image.classList.add('com-img');
        let inside=document.createElement("div");
        inside.classList.add("inside")
        let name=document.createElement("p");
        name.style.fontWeight=800;
        name.style.fontSize="13.5px";
        name.innerText=result.name
        let content=document.createElement("p");
        content.innerHTML=result.cont;
        content.style.fontSize="12.5px";
        newElem.appendChild(image);
        newElem.appendChild(inside);
        inside.appendChild(name);
        inside.appendChild(content);
        newElem.style.opacity="0"
        document.getElementById(`${e.target.parentElement.id}`).children[4].appendChild(newElem)
        setTimeout(function() {
          newElem.style.opacity = 1;
          
        }, 20);
        
      });
    }
    catch(e){
      console.log(e)
    }
  }
    const testForLoad=(e)=>{
      
      if(e.target.files.length>=1){
        setImageSize(`${Math.round(e.target.files[0].size*100/1024)/100}KB`)
      }
      else
        setImageSize("")
      return;
    }

    const emojieHandle=(e)=>{
        
        const pick=document.getElementById('emojiePicker')
        
        if(emojieTextArea!==null){
         setEmojieTextArea(null)
         pick.style.left=`${e.target.offsetLeft}px`
         pick.style.top=`${e.target.offsetTop-240}px`
         pick.style.opacity=0
         return;
        }
        else
          {
          pick.style.left=`${e.target.offsetLeft}px`
          pick.style.top=`${e.target.offsetTop-240}px`
          setEmojieTextArea(e.target.parentElement.children[1])
          pick.style.opacity=1
          pick.style.width="150px"
          pick.style.height="230px"
          pick.style.zIndex=2
        }
    }
    const handleDateNow=(d)=>{
      let givenDate = new Date(d); 
      
      let now = new Date();
      let difference = (now - givenDate) / (1000 * 60 * 60 ); 
      
      let res=difference;
      if(res>=8640){
        res=Math.floor(res/24/30/12)
        return `${res} Years ago`
      }
      if(res>=720){
        res=Math.floor(res/24/30)
        return `${res} Month(s) ago`
      }
      if(res<24){
        return "Today"
      }
      if(res>=24){
        res=Math.floor(res/24)
        return `${res} Day(s) ago`
      }
    }
    const handlePoint=(e)=>{
      
      const id=e.currentTarget.parentElement.parentElement.id
      const tar=e.currentTarget.children[1]
      tar.classList.toggle('show')
      
      const res=post.find((value)=>{
        return value.id===parseInt(id)
      })
      
      if(snapshot.email===res.email && tar.children.length===1){
        const p=document.createElement('p')
        p.classList.add('dropdown-item')
        p.innerText="Delete this post"
        
        p.onclick=(e)=>{
            deletePost(e)
        }
        tar.appendChild(p);
        
      }
      return;
    }
    const postLoadAnim=<div class="dot-elastic" style={{margin: "auto"}}></div>
    const suc=<div className='wr' style={{top:`${window.scrollY+444}px`,position:"relative"}}><div className="wrapperAlert">
    
    <div className="contentAlert">

      <div className="topHalf">

        <p><svg viewBox="0 0 512 512" width="100" title="check-circle">
          <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z" />
          </svg></p>
        <h1>Done</h1>
      </div>

      <div className="bottomHalf">

        <p>report has been sent we will review it as soon as possible</p>

        <button id="alertMO" onClick={()=>setShowAlert(false)}>Moving On</button>

      </div>

    </div>        

</div>
</div>
    const report=async(e)=>{
      const data={
        email:snapshot.email,
        id: e.currentTarget.parentElement.parentElement.parentElement.parentElement.id,
        date: getTime()
      }
      try{
        const result=await axios.post("https://backendnodejssocialmedia.onrender.com/report",data)
        if(result.data==="succ"){
          setShowAlert(true)
        }
      }
      catch(e){
        console.log(e)
      }
      return;
    }
    const redirectToProfile=(e)=>{
      const id=e.currentTarget.parentElement.parentElement.parentElement.parentElement.id
      const elem=post.find((post)=>post.id===parseInt(id)).email
      navigate(`/home/profile:${elem}`)
    }
    return(
        <div className='home' style={{background: "white" }}>
          {showAlert ? suc : ""}
          <div className='bigReload' >
             <img src={reload} alt="reload"/>
          </div>
          <div className='dropDown'>
            <p onClick={()=>{setTimeout(()=>document.getElementsByClassName("dropDown")[0].style.opacity="0",10);setTimeout(()=>document.getElementsByClassName("dropDown")[0].style.display="none",)}}>Return</p>
             
             <div  onClick={()=>navigate("/home/settings")} style={{cursor:"pointer"}}>
               <img style={{cursor:"pointer" , width:'30px'}} src={set} alt="settings"></img>
               <p>Settings</p>
             </div>
             <div onClick={()=>navigate("/home/messages")} style={{cursor:"pointer"}}>
              <img style={{cursor:"pointer" , width:'30px'}} src={messenger} alt="messenger" ></img>
              <p>Messenger</p>
             </div>
             <div>
              
              <img style={{cursor:"pointer" , width:'30px'}} src={logOut} onClick={()=>{snapshot.authen=false;snapshot.email="";snapshot.photo="";snapshot.userName="";navigate("/")}}  alt="log Out"></img>
              <p>log out</p>
             </div>
          </div>
        <div className="reload" onClick={handleReload} style={{display: "flex",alignItems:"center", justifyContent:'center', padding:"10px",backgroundColor:"#0062ff96",position:"fixed",bottom:"0" , right:'0'}}><img style={{width: "30px"}} src={reload} alt="reloads" ></img></div>
        <div className="navigation" style={{position: "relative"}}>
       
    <div className="profile">
       <img className="profile-pic" src={userName.photo} width="25px" height="25px" alt=""/>
       <p>{userName.name}</p>
    </div>
    
    <div className="nav-logos" style={{display:'flex', gap:"15px" , position: "absolute",right:"30px"}}>
           <img style={{cursor:"pointer" , width:'30px'}} src={set} alt="settings" onClick={()=>navigate("/home/settings")}></img>
           <img style={{cursor:"pointer" , width:'30px'}} src={messenger} alt="messenger" onClick={()=>navigate("/home/messages")}></img>
           <img style={{cursor:"pointer" , width:'30px'}} src={logOut}  onClick={()=>{snapshot.authen=false;snapshot.email="";snapshot.photo="";snapshot.userName="";navigate("/")}} alt="log Out"></img>
        </div>
      <div className='nav-logos-mobile' style={{display:"none"}}>
            <button onClick={()=>{document.getElementsByClassName("dropDown")[0].style.display="flex";setTimeout(()=>document.getElementsByClassName("dropDown")[0].style.opacity="1",10)}}>&bull;&bull;&bull;</button>
      </div>
  </div>


<div className="share">
   <div className='share-container'>
      
         <img className="profile-pic"  src={userName.photo} width="25px" height="25px" alt=""/>
         <input type='text' placeholder={`what's new ${userName.name}`} id="share" className='form-control'></input>
         <span id="up-span" style={{position:"relative"}}>
         <img src={up} style={{cursor:"pointer" , width:'28px'}} alt='upload' className='up-img' onClick={()=>{document.getElementById('input-file').click()}}></img>
         <p style={{position:"absolute",bottom:"-30px"}}>{imageSize}</p>
         </span>
         <input type='file' id='input-file'  onChange={testForLoad} alt='upload-image'></input>
         <button className="button-43" onClick={handleFile}>Share</button>
      
    </div>
    
</div>

{postLoading ? postLoadAnim : ""}
      
        
      
      
        <div id="emojiePicker" style={{position: "absolute",width:"0.1px",height:"0.1px"}}>
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
   
    
<div className="tumbler">

 {
 post.map((obj,count)=>{
  return(
    <div className="container" key={obj.id} id={obj.id}>
      
    <div className="top">

      <div className="image">
        <img className="img" src={obj.profile} alt=""/>
      </div>

      <div className="information">
        <div className="username">
          <div className="designation" onClick={redirectToProfile}> {obj.name} </div>
          
        </div>
        <div className="name">{obj.date}</div>
      </div>

      <div className="menu" onClick={handlePoint}>
        <button>&bull;&bull;&bull;</button>
        <div className='dropdown-menu'>
          <p onClick={report} id="test" className='dropdown-item'>Report to the admin</p>
        </div>
      </div>

    </div>

    <div className="middle">

      <img src={obj.photo} onDoubleClick={handleClick} alt="post" className="post"></img>
      <img className="heart" src={heart} alt="like"></img>

    </div>

    <div className="caption">
      <div className="content">
        <div className="information">
          
          
          <div className="text"> <p>{obj.content}</p> </div> 

        </div> 
      </div>

    <div className="likes"> {obj.num} likes</div>

    
    </div>

    <div className="direction" style={{cursor:"pointer"}} id="viewP" onClick={loadComment}>View comments</div>

    <div className="all-com">
       
       
     </div>

    <div className="time" style={{fontSize: '13px',fontWeigth:"1000"}}> {handleDateNow(obj.date)} </div>

    <div className="bottom">

      <div className="bin">
        <img src={smile} width="30px" onClick={emojieHandle} alt='smile'/>
        <textarea cols="30" rows="1" id="comment" placeholder="Add a comment..."></textarea>
        <button id="post" onClick={sendComment}>Post</button>
      </div>

    </div>
  </div>
  )
 })
 }


</div>
<img src={reload}  alt="reload" id="relo"/>
        </div>
    )
}