import { InvoiceTypes } from '../models/invoiceTypes.model'

export const MOCK_INVOICE_TYPES: InvoiceTypes = {
  data: [
    {
      id: 1,
      code: 'CONSULTING',
      name: 'Ráðgjöf',
      description: 'Ráðgjafaþjónusta og sérfræðiaðstoð',
    },
    {
      id: 2,
      code: 'UTILITIES',
      name: 'Veitur',
      description: 'Rafmagn, hiti og vatn',
    },
    {
      id: 3,
      code: 'SERVICES',
      name: 'Þjónusta',
      description: 'Almenn þjónusta og viðhald',
    },
    {
      id: 4,
      code: 'TRANSPORT',
      name: 'Flutningar',
      description: 'Flutningsþjónusta og vöruflutngar',
    },
    {
      id: 5,
      code: 'ENTERTAINMENT',
      name: 'Afþreying',
      description: 'Afþreyingarþjónusta og viðburðir',
    },
    {
      id: 6,
      code: 'TECHNOLOGY',
      name: 'Tækni',
      description: 'Hugbúnaður og tækniþjónusta',
    },
    {
      id: 7,
      code: 'REAL_ESTATE',
      name: 'Fasteignir',
      description: 'Fasteignaþjónusta og eignaviðskipti',
    },
    {
      id: 8,
      code: 'FOOD_BEVERAGE',
      name: 'Matvörur og drykkjarvörur',
      description: 'Matvæli og drykkjarvörur',
    },
    {
      id: 9,
      code: 'EQUIPMENT',
      name: 'Búnaður',
      description: 'Vélar, tæki og annar búnaður',
    },
    {
      id: 10,
      code: 'LEGAL',
      name: 'Lögfræðiþjónusta',
      description: 'Lögfræðiaðstoð og réttarráðgjöf',
    },
  ],
  totalCount: 10,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
