import { proxy } from 'valtio'

const auth = proxy({ authen: false , email:"",userName:"" , photo:""})

export default auth