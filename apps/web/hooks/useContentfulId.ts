import { useEffect, useContext } from 'react'
import { GlobalContext } from '../context'

export const useContentfulId = (
  pageId: string,
  subpageId?: string,
  subSubPageId?: string,
) => {
  const { setContentfulIds } = useContext(GlobalContext)

  useEffect(() => {
    if (pageId) {
      setContentfulIds([pageId, subpageId, subSubPageId])
    }
    return () => setContentfulIds([])
  }, [pageId, subpageId, subSubPageId])
}

export default useContentfulId
