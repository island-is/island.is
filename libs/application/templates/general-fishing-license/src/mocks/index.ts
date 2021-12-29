import { ShipInformationType } from '../types'

export const mockShips = [
  {
    shipName: 'Þorsteinn',
    shipNumber: '1755',
    grossTonn: '24',
    length: '33 metrar',
    homePort: 'Grindavík',
    seaworthiness: new Date('21 Aug 2022 00:12:00 GMT'),
    price: 22490,
    explanation: 'Engin gild veiðileyfi fundust',
  },
  {
    shipName: 'Auðbjörg',
    shipNumber: '1654',
    grossTonn: '12',
    length: '24 metrar',
    homePort: 'Grindavík',
    seaworthiness: new Date('23 Jan 2021 00:12:00 GMT'),
    price: 22490,
    explanation: 'Engin gild veiðileyfi fundust',
  },
] as ShipInformationType[]

export const mockShipsWithFishingLicense = [
  {
    shipName: 'Hólmsteinn',
    shipNumber: '2355',
    grossTonn: '33',
    length: '24 metrar',
    homePort: 'Grindavík',
    seaworthiness: new Date('21 Aug 2022 00:12:00 GMT'),
    price: 22490,
    explanation: 'Almennt veiðileyfi með Krókaafla',
  },
  {
    shipName: 'Björgvin',
    shipNumber: '1543',
    grossTonn: '55',
    length: '',
    homePort: 'Grindavík',
    seaworthiness: new Date('23 Jan 2021 00:12:00 GMT'),
    price: 22490,
    explanation: 'Almennt veiðileyfi með aflamarki',
  },
] as ShipInformationType[]
