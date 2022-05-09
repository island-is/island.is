import { useEffect, useState } from 'react'
import { getFeatureFlag } from '../utils/featureFlag'

export const useFeatureFlag = (flag: string, defaultValue: boolean) => {
  const [state, setState] = useState({
    loading: true,
    value: defaultValue,
  })

  useEffect(() => {
    let isMounted = true
    const fetchFlag = async () => {
      const value = await getFeatureFlag(flag, defaultValue)
      if (isMounted) setState({ loading: false, value })
    }
    fetchFlag()

    return () => (isMounted = false)
  }, [defaultValue, flag])

  return state
}

export default useFeatureFlag
