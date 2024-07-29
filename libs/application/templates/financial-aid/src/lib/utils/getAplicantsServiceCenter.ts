import {
  Application,
  NationalRegistryIndividual,
} from '@island.is/application/types'
import { serviceCenters } from '@island.is/financial-aid/shared/data'

export const getAplicantsServiceCenter = (application: Application) => {
  const { externalData } = application

  const applicantsCenter = serviceCenters.find(
    (serviceCenter) =>
      serviceCenter.number ===
      Number(
        (externalData?.nationalRegistry?.data as NationalRegistryIndividual)
          ?.address?.municipalityCode,
      ),
  )
  return applicantsCenter
}
