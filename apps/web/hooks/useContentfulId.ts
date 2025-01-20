import { useContext, useEffect } from 'react'

import { GlobalContext } from '../context'

export const useContentfulId = (
  pageId?: string,
  subpageId?: string,
  subSubPageId?: string,
) => {
  const { setContentfulIds } = useContext(GlobalContext)

  useEffect(() => {
    if (pageId) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore make web strict
      setContentfulIds([pageId, subpageId, subSubPageId])
    }
    return () => {
      setContentfulIds([])
    }
  }, [pageId, subpageId, subSubPageId])
}

export default useContentfulId
