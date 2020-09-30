import { User } from 'oidc-client'
import { useState, useEffect } from 'react'

interface NationalRegistryGeneralLookupResponse {
  source: 'Þjóðskrá' | 'Fyrirtækjaskrá'
  ssn: string
  name: string
  gender: 'kk' | 'kvk'
  address: string
  postalcode: number
  city: string
  lastmodified: string
  charged: boolean
  error?: string
}

export const useNatRegGeneralLookup = (userInfo: User) => {
  const [state, setState] = useState<{
    data: NationalRegistryGeneralLookupResponse | null
    loading: boolean
    error: boolean
  }>({
    data: null,
    loading: false,
    error: false,
  })

  useEffect(() => {
    setState({ ...state, loading: true })
    setTimeout(() => {
      setState({
        data: {
          source: 'Þjóðskrá',
          ssn: userInfo.profile.natreg,
          name: userInfo.profile.name,
          gender: 'kk',
          address: 'Íbúðastaðir 35d',
          postalcode: 119,
          city: 'Reykjavík',
          lastmodified: '2020-07-27T00:00:00.000',
          charged: true,
          error: '',
        },
        loading: false,
        error: false,
      })
    }, 500)
  }, [])

  return { ...state }
}
