import {useEffect} from "react"

export default function Logout(props) {

  const handleRedirect = (path) => {
    window.location.href = path;
  }

  const handleLogout = async () => {
    try{
      const response = await fetch('http://localhost:5000/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      })

      const data = await response.json()
      console.log(data)

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