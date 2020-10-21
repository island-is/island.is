type MockDelegationlistItem = {
  id: string
  provider: string
  title: string
  date: string
}

export const mockDelegationList: MockDelegationlistItem[] = [
  {
    id: '1',
    provider: 'Ríkislögreglustjóri',
    title: 'Ökuskírteini',
    date: '23.04.2020',
  },
  {
    id: '2',
    provider: 'Samgöngustofa',
    title: 'Vinnuvélaleyfi',
    date: '23.04.2020',
  },
  {
    id: '3',
    provider: 'Lögreglan',
    title: 'Skotvopnaleyfi',
    date: '23.04.2020',
  },
  {
    id: '4',
    provider: 'Vegagerðin',
    title: 'Loftbrú',
    date: '23.04.2020',
  },
]
