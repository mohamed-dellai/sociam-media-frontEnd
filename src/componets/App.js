import {SignUp} from './signup'
import {SignIn} from './signin.js'
import {Home} from './home.jsx'

import {Settings} from './settings'
import {Messages} from './messages'
import {BrowserRouter as Router , Routes ,Route} from 'react-router-dom'
import PrivateRoute from './privateRoutes'
function App() {
  return (
    
       <Router>
          <Routes>
             <Route path="/" element={<SignUp/>} > </Route>
             <Route path="/signin" element={<SignIn/>} > </Route>
             <Route element={<PrivateRoute/>}>
                <Route path="/home" element={<Home/>}> 
                </Route>
                
                <Route path="/home/settings" element={<Settings/>}></Route>
                <Route path="/home/messages" element={<Messages/>}></Route>
             </Route>
          </Routes>
        </Router>
        
    
  );
}

export default App;
