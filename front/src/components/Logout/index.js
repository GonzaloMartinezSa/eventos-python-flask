import {useEffect} from "react"

import {BACKEND as backend_api} from '../../config/config'


export default function Logout(props) {

  const handleRedirect = (path) => {
    window.location.href = path;
  }

  const handleLogout = async () => {
    try{
      const response = await fetch(`${backend_api}/users/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      })

      const data = await response.json()
      //console.log(data)

      if(response.status === 200 || response.status === 401) {
        props.removeToken()
        localStorage.removeItem('user_id')
        handleRedirect('/login')
      }
    }
    catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleLogout()
  })

  return ;

}