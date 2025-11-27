import { useContext, useEffect } from 'react'

import { GlobalContext } from '../context'
import type { LinkType } from './useLinkResolver'

export const useLocalLinkTypeResolver = (linkType?: LinkType) => {
  const { setResolveLinkTypeLocally, setLinkType } = useContext(GlobalContext)

  useEffect(() => {
    setResolveLinkTypeLocally(Boolean(linkType))
    setLinkType(linkType ?? null)
    return () => {
      setResolveLinkTypeLocally(false)
      setLinkType(null)
    }
  }, [linkType])
}

export default useLocalLinkTypeResolver
