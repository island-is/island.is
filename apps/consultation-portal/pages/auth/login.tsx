import { useUser } from '../../context/UserContext'
import { useRouter } from 'next/router'

const Login = () => {
  let prevPath = ''
  if (typeof window !== 'undefined') {
    prevPath = localStorage.getItem('pathname')
  }

  const { loginUser, isAuthenticated } = useUser()
  const router = useRouter()
  const query = router.query

  loginUser({ token: query.token })

  if (isAuthenticated) {
    window.location.href = prevPath
  }
  return <p>Auðkenning í gangi...</p>
}

export default Login
