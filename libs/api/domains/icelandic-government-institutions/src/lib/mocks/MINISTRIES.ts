import { Ministries } from '../models/ministries.model'

export const MOCK_MINISTRIES: Ministries = {
  data: [
    { id: 'FJR', name: 'Fjármála- og efnahagsráðuneytið' },
    { id: 'INR', name: 'Innviðaráðuneytið' },
    { id: 'MRN', name: 'Menningar- og viðskiptaráðuneytið' },
    { id: 'HLR', name: 'Heilbrigðisráðuneytið' },
    { id: 'DGR', name: 'Dómsmálaráðuneytið' },
  ],
  totalCount: 5,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
}
