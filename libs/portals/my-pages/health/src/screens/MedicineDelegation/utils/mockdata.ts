import React from 'react'

export interface Delegation {
  id: string
  name: string
  nationalId: string
  delegationType: string
  dateFrom: Date
  dateTo: Date
  change?: React.ReactNode
  isValid: boolean
}

export const delegationData: Delegation[] = [
  {
    id: '1',
    name: 'Sigríður Guðmundsdóttir',
    nationalId: '2112827199',
    delegationType: 'Sækja lyf og fletta upp lyfjaávísun',
    dateFrom: new Date('2023-10-01'),
    dateTo: new Date('2023-12-01'),
    isValid: true,
  },
  {
    id: '2',
    name: 'Jónas Ingi Karlsson',
    nationalId: '2102034399',
    delegationType: 'Sækja lyf',
    dateFrom: new Date('2024-01-01'),
    dateTo: new Date('2024-03-30'),
    isValid: false,
  },
]

export interface DelegationInput {
  nationalId?: string
  dateFrom?: Date
  dateTo?: Date
  lookUp?: boolean
}
