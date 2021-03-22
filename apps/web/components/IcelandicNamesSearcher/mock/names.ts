import { format } from 'date-fns'
import { factory, faker, simpleFactory } from '@island.is/shared/mocking'

export type Gender = 'males' | 'females'
export type Status = 'approved' | 'denied' | 'pending' | null

export interface Name {
  gender: Gender
  name: string
  isMiddleName: boolean
  verdictDate: string
  status: Status
}

export const genderValues = ['males' as Gender, 'females' as Gender]

export const statusValues = [
  'approved' as Status,
  'denied' as Status,
  'pending' as Status,
  null as Status,
]

let status

const femaleName = factory<Name>({
  gender: 'females',
  name: () => faker.name.firstName(1),
  isMiddleName: () => faker.random.boolean(),
  status: () => {
    status = statusValues[faker.random.number(statusValues.length - 1)]
    return status
  },
  verdictDate: () => {
    let verdictDate = ''

    if (status === 'approved' || status === 'denied') {
      verdictDate = format(faker.date.past(), 'd.M.yy')
    }

    return verdictDate
  },
})

const maleName = factory<Name>({
  gender: 'males',
  name: () => faker.name.firstName(0),
  isMiddleName: () => faker.random.boolean(),
  status: () => {
    status = statusValues[faker.random.number(statusValues.length - 1)]
    return status
  },
  verdictDate: () => {
    let verdictDate = ''

    if (status === 'approved' || status === 'denied') {
      verdictDate = format(faker.date.past(), 'd.M.yy')
    }

    return verdictDate
  },
})

export default simpleFactory(
  (): Name => {
    const factory = faker.random.arrayElement([maleName, femaleName])
    return factory()
  },
)
