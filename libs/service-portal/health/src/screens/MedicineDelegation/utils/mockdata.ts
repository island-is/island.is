import React from 'react'

interface Delegation {
  id: string
  name: string
  kennitala: string
  delegationType: string
  date: string
  change?: React.ReactNode
}

export const delegationData: Delegation[] = [
  {
    id: '1',
    name: 'Sigríður Guðmundsdóttir',
    kennitala: '2112827199',
    delegationType: 'Sækja lyf / Uppfletting',
    date: '20.12.2024',
  },
  {
    id: '2',
    name: 'Jónas Ingi Karlsson',
    kennitala: '2102034399',
    delegationType: 'Sækja lyf',
    date: '01.01.2024',
  },
]

export interface DelegationInput {
  nationalId: string
  date: Date
  lookUp?: boolean
}
