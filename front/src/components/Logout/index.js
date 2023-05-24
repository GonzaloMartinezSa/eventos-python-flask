import {useEffect} from "react"

export default function Logout(props) {

  const handleRedirect = (path) => {
    window.location.href = path;
  }

  const handleLogout = async () => {
    try{
      // const response = await fetch('http://localhost:5000/logout', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // })

      // const data = await response.json()
      // console.log(data)

      // if(response.status === 200) {
      //   //handleRedirect('/');
      //   props.token()
      //   //localStorage.removeItem('user_id')
      // }
      props.token()
      localStorage.removeItem('user_id')
      handleRedirect('/login')
    }
    catch(error) {
      console.error(error)
    }
  }

  useEffect(() => {
    handleLogout()
  }, [])

  return ;

}