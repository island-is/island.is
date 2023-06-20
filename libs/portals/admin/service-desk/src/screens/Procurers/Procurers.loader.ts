import { WrappedLoaderFn } from '@island.is/portals/core'
import { companiesMock, Company } from '../mockProcures'

export const procurersLoader: WrappedLoaderFn = ({ client }) => {
  return async ({ params }): Promise<Company> => {
    if (!params['companyId']) {
      throw new Error('Tenant not found')
    }

    // Replace this with a call to server
    const company = companiesMock.find((p) => p.id === params['companyId'])

    if (!company) {
      throw new Error('Procurers not found')
    }

    return company
  }
}
