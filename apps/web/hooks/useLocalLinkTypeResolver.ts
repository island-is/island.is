import { useEffect, useContext } from 'react'
import { GlobalContext } from '../context'

export const useLocalLinkTypeResolver = () => {
  const { setResolveLinkTypeLocally } = useContext(GlobalContext)

  useEffect(() => {
    setResolveLinkTypeLocally(true)
    return () => setResolveLinkTypeLocally(false)
  }, [])
}

export default useLocalLinkTypeResolver
