import { useContext, useEffect } from 'react'

import { GlobalContext } from '../context'

export const useContentfulId = (...ids: (string | undefined)[]) => {
  const { setContentfulIds } = useContext(GlobalContext)
  const idsKey = ids.join()

  useEffect(() => {
    if (ids[0]) {
      setContentfulIds(ids.filter((id): id is string => Boolean(id)))
    }
    return () => {
      setContentfulIds([])
    }
  }, [idsKey])
}

export default useContentfulId
