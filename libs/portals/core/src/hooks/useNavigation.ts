import { useMemo } from 'react'
import { usePortalMeta } from '../components/PortalMetaProvider'

export const useNavigation = () => {
  const { masterNav } = usePortalMeta()

  const navigation = useMemo(() => {
    // TODO filter
    return masterNav
  }, [masterNav])

  return navigation
}
