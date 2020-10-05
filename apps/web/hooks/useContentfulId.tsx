import { useEffect, useContext } from 'react'
import { GlobalContext } from '../context'

export const useContentfulId = (id: string) => {
  const { setContentfulId } = useContext(GlobalContext)

  useEffect(() => {
    if (id) {
      setContentfulId(id)
    }

    return () => setContentfulId('')
  }, [id])
}

export default useContentfulId
