import { GrantDto } from '../dto/grant.dto'

export const GRANTS: Array<GrantDto> = [
  {
    id: '123',
    applicationId: '1234',
    name: 'Listamannalaun',
    category: 'Listastyrkur',
    dateFrom: new Date('1995-12-17T03:24:00').toISOString(),
    dateTo: new Date('2030-12-17T03:24:00').toISOString(),
    isAvailable: true,
    fundUrl: 'https://beta.dev01.devland.is/',
  },
  {
    id: '234',
    applicationId: '999',
    name: 'Kúl gæi styrkur',
    category: 'Fyrir rizzlara',
    dateFrom: new Date('2022-12-17T03:24:00').toISOString(),
    dateTo: new Date('2023-12-17T03:24:00').toISOString(),
    isAvailable: false,
    fundUrl: 'https://beta.dev01.devland.is/',
  },
]

export const APPLICATION_IDS = ['999', '888']
