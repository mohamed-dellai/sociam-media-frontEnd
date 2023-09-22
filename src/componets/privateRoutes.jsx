import {Outlet,Navigate} from "react-router-dom"
import { proxy } from "valtio"
import auth from '../globalstate.js/global.jsx'
const PrivateRoute=()=>{
    let  snapshot=proxy(auth)
    let auth1=snapshot.authen
    return(
        auth1 ? <Outlet/> : <Navigate to="/"/>
    )
}

export default PrivateRoute