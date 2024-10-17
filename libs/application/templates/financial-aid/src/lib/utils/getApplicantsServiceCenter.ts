import { getValueViaPath } from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { serviceCenters } from '@island.is/financial-aid/shared/data'

export const getApplicantsServiceCenter = (application: Application) => {
  const { externalData } = application
  const municipalityCode = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.address.municipalityCode',
  )

  const applicantsCenter = serviceCenters.find(
    (serviceCenter) => serviceCenter.number === Number(municipalityCode),
  )
  return applicantsCenter
}
