import { useEffect, useContext } from 'react'
import { GlobalContext } from '../context'

export const useResolveLinkTypeLocally = () => {
  const { setResolveLinkTypeLocally } = useContext(GlobalContext)

  useEffect(() => {
    setResolveLinkTypeLocally(true)
    return () => setResolveLinkTypeLocally(false)
  }, [])
}

export default useResolveLinkTypeLocally
