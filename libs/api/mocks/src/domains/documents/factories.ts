import { factory, faker } from '@island.is/shared/mocking'
import { DocumentV2 } from '../../types'

const categoryIds = ['1', '2', '3', '4', '5']
export const senders = [
  { id: '888888888', name: 'Skatturinn - innheimta' },
  { id: '222222222', name: 'Þjóðskrá' },
  { id: '111111111', name: 'Tryggingastofnun' },
  { id: '333333333', name: 'Ísland.is' },
]

export const categories = [
  {
    id: '1',
    name: 'Fjármál',
  },
  {
    id: '2',
    name: 'Börn og ungmenni',
  },
  {
    id: '3',
    name: 'Líf og Heilsa',
  },
  {
    id: '4',
    name: 'Húsnæði og eignir',
  },
  {
    id: '5',
    name: 'Atvinna',
  },
]

export const document = factory<DocumentV2>({
  id: () => faker.datatype.uuid(),
  bookmarked: () => faker.datatype.boolean(),
  categoryId: () => faker.random.arrayElement(categoryIds),
  documentDate: () => faker.date.past().toISOString(),
  isUrgent: () => faker.datatype.boolean(),
  opened: () => faker.datatype.boolean(),
  publicationDate: () => faker.date.past().toISOString(),
  subject: () => faker.lorem.sentence(),
  sender: () => faker.random.arrayElement(senders),
})
