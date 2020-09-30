import { User } from 'oidc-client'
import { useState, useEffect } from 'react'

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

export const useNatRegFamilyLookup = (userInfo: User) => {
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
          familyssn: userInfo.profile.natreg,
          results: [
            {
              banlabel: '',
              ssn: userInfo.profile.natreg,
              name: userInfo.profile.name,
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
