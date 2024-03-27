import { useEffect } from 'react'
import router from 'next/router'

const Index = () => {
  useEffect(() => {
    router.push('/Forms')
  }, [])

  return <></>
}

export default Index
