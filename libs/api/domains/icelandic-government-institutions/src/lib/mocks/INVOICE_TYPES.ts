import { InvoiceTypes } from '../models/invoiceTypes.model'

export const MOCK_INVOICE_TYPES: InvoiceTypes = {
  data: [
    {
      code: 'CONSULTING',
      name: 'Ráðgjöf',
      description: 'Ráðgjafaþjónusta og sérfræðiaðstoð',
    },
    {
      code: 'UTILITIES',
      name: 'Veitur',
      description: 'Rafmagn, hiti og vatn',
    },
    {
      code: 'SERVICES',
      name: 'Þjónusta',
      description: 'Almenn þjónusta og viðhald',
    },
    {
      code: 'TRANSPORT',
      name: 'Flutningar',
      description: 'Flutningsþjónusta og vöruflutngar',
    },
    {
      code: 'ENTERTAINMENT',
      name: 'Afþreying',
      description: 'Afþreyingarþjónusta og viðburðir',
    },
    {
      code: 'TECHNOLOGY',
      name: 'Tækni',
      description: 'Hugbúnaður og tækniþjónusta',
    },
    {
      code: 'REAL_ESTATE',
      name: 'Fasteignir',
      description: 'Fasteignaþjónusta og eignaviðskipti',
    },
    {
      code: 'FOOD_BEVERAGE',
      name: 'Matvörur og drykkjarvörur',
      description: 'Matvæli og drykkjarvörur',
    },
    {
      code: 'EQUIPMENT',
      name: 'Búnaður',
      description: 'Vélar, tæki og annar búnaður',
    },
    {
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
