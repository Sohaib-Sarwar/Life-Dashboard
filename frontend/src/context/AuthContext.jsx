import React, { createContext, useState, useEffect } from 'react'
import * as authApi from '../api/authApi'


export const AuthContext = createContext()


export function AuthProvider({children}){
const [user, setUser] = useState(null)
const [loading, setLoading] = useState(true)


useEffect(()=>{
let mounted = true
authApi.me()
.then(res => { if(mounted) setUser(res.data.user) })
.catch(()=> { if(mounted) setUser(null) })
.finally(()=> { if(mounted) setLoading(false) })
return ()=>{ mounted=false }
},[])


const signIn = async (email, password) => {
const res = await authApi.login(email, password)
setUser(res.data.user)
return res
}


const signOut = async ()=>{
await authApi.logout()
setUser(null)
}


const signUp = async (payload)=>{
const res = await authApi.register(payload)
setUser(res.data.user)
return res
}


return (
<AuthContext.Provider value={{user, loading, signIn, signOut, signUp}}>
{children}
</AuthContext.Provider>
)
}