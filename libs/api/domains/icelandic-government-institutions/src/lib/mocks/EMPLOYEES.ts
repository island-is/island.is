import { Employees } from '../models/employees.model'

export const MOCK_EMPLOYEES: Employees = {
  totalCount: 2,
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
  data: [
    {
      name: 'Finyan Már ÞÍ Marteinsson',
      email: 'fakefinyan@fsre.is',
      job: 'Fjármál',
      phoneNumber: undefined,
      location: {
        address: 'Borgartún 7A',
        postalCode: '105 Reykjavík',
      },
      department: 'FSR Framkvæmdasvið',
      currentlyActive: undefined,
    },
    {
      name: 'Ragnheiður ÞÍ Nakitende',
      email: 'fakeragnheidur@fsre.is',
      job: 'Sérfræðingur',
      phoneNumber: undefined,
      location: {
        address: 'Borgartún 7A',
        postalCode: '105 Reykjavík',
      },
      department: 'FSR Fjármál og stafrænir innviðir',
      currentlyActive: undefined,
    },
  ],
}
