import { useState, useEffect } from 'react'
import { UserWithMeta } from '@island.is/service-portal/core'

type FamilyMember = {
  banlabel?: string
  ssn: string
  name: string
  address: string
  towncode: number
  postalcode: number
  city: string
}

export interface NationalRegistryFamilyLookupResponse {
  source: 'Þjóðskrá' | 'Fyrirtækjaskrá'
  familyssn: string
  results: FamilyMember[]
}

export const useNatRegFamilyLookup = (userInfo: UserWithMeta) => {
  const [state, setState] = useState<{
    data: NationalRegistryFamilyLookupResponse | null
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
          familyssn: userInfo.user.profile.natreg,
          results: [
            {
              banlabel: '',
              ssn: userInfo.user.profile.natreg,
              name: userInfo.user.profile.name,
              address: 'Heimilisgata 18',
              towncode: 119,
              postalcode: 119,
              city: 'Reykjavík',
            },
          ],
        },
        loading: false,
        error: false,
      })
    }, 500)
  }, [])

  return { ...state }
}
