import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'

export const getTenantsNationalId = (application: Application) => {
  try {
    const tenants = getValueViaPath(
      application.answers,
      'tenantInfo.table',
      [],
    ) as Array<{ nationalIdWithName: { nationalId: string } }>
    const tenantsNationalIds = tenants.map(
      (tenant) => tenant.nationalIdWithName.nationalId,
    )
    console.log(tenantsNationalIds)
    return tenantsNationalIds
  } catch (error) {
    console.error(error)
  }
}
