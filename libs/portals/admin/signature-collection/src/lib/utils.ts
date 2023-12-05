export const pageSize = 10

export const countryAreas = [
  { value: 'Sunnlendingafjórðungur', label: 'Sunnlendingafjórðungur' },
  { value: 'Vestfirðingafjórðungur', label: 'Vestfirðingafjórðungur' },
  { value: 'Norðlendingafjórðungur', label: 'Norðlendingafjórðungur' },
  { value: 'Austfirðingafjórðungur', label: 'Austfirðingafjórðungur' },
]

export type Filters = {
  area: Array<string>
  input: string
}

export const resultsForComparison = {
  nationalId: '010130-2989',
  name: 'Guðmundur Guðmundsson',
  list: 'Gervimaður Útlönd - Sunnlendingafjórðungur',
}
