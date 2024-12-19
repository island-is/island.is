import React from 'react'

export interface Delegation {
  id: string
  name: string
  nationalId: string
  delegationType: string
  date: Date
  change?: React.ReactNode
}

export const delegationData: Delegation[] = [
  {
    id: '1',
    name: 'Sigríður Guðmundsdóttir',
    nationalId: '2112827199',
    delegationType: 'Sækja lyf / Uppfletting',
    date: new Date('2023-12-01'),
  },
  {
    id: '2',
    name: 'Jónas Ingi Karlsson',
    nationalId: '2102034399',
    delegationType: 'Sækja lyf',
    date: new Date('2024-03-30'),
  },
]

export interface DelegationInput {
  nationalId: string
  date: Date
  lookUp?: boolean
}
