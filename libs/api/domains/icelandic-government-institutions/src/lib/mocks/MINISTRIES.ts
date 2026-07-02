import { Ministries } from '../models/ministries.model'

export const MOCK_MINISTRIES: Ministries = {
  data: [
    { code: 'FJR', name: 'Fjármála- og efnahagsráðuneytið' },
    { code: 'INR', name: 'Innviðaráðuneytið' },
    { code: 'MRN', name: 'Menningar- og viðskiptaráðuneytið' },
    { code: 'HLR', name: 'Heilbrigðisráðuneytið' },
    { code: 'DGR', name: 'Dómsmálaráðuneytið' },
  ],
  totalCount: 5,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
