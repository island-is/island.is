import { useEffect, useContext } from 'react'
import { GlobalContext } from '../context'

export const useContentfulId = (pageId: string, subpageId?: string) => {
  const { setContentfulId } = useContext(GlobalContext)

  useEffect(() => {
    if (pageId) {
      setContentfulId(pageId, subpageId)
    }

    return () => setContentfulId('')
  }, [pageId, subpageId])
}

export default useContentfulId
