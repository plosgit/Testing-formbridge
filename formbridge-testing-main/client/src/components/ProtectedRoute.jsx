import {useContext, useEffect, useState} from 'react'
import {Navigate} from 'react-router'
import {GlobalContext} from '../GlobalContext.jsx'

export default function ProtectedRoute({children, requiredRole}) {
  const {user, getLogin} = useContext(GlobalContext)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      if (!user) {
        await getLogin()
      }
      setIsLoading(false)
    }
    checkAuth()
  }, [])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <Navigate to='/login' replace/>
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to='/support' replace/>
  }

  return children
}