import { GrantDto } from '../dto/grant.dto'

export const GRANTS: Array<GrantDto> = [
  {
    id: '123',
    fundId: '999',
    name: 'Listamannalaun',
    category: 'Listastyrkur',
    dateFrom: new Date('1995-12-17T03:24:00').toISOString(),
    dateTo: new Date('2030-12-17T03:24:00').toISOString(),
    isAvailable: true,
    url: 'https://beta.dev01.devland.is/',
  },
  {
    id: '234',
    fundId: '888',
    name: 'Kúl gæi styrkur',
    category: 'Fyrir rizzlara',
    dateFrom: new Date('2022-12-17T03:24:00').toISOString(),
    dateTo: new Date('2023-12-17T03:24:00').toISOString(),
    isAvailable: false,
    url: 'https://beta.dev01.devland.is/',
  },
]

export const FUND_IDS = ['999', '888']
