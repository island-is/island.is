import {
  EstateAsset,
  EstateInfo,
  EstateMember,
} from '@island.is/clients/syslumenn'
import { infer as zinfer } from 'zod'
import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'

type InheritanceReportSchema = zinfer<typeof inheritanceReportSchema>
type InheritanceData = InheritanceReportSchema['assets']

const initialMapper = <T>(element: T) => {
  return {
    ...element,
    initial: true,
    enabled: true,
    propertyValuation: '0',
  }
}

export const estateTransformer = (estate: EstateInfo): InheritanceData => {
  const realEstate = estate.assets.map((el) => initialMapper<EstateAsset>(el))
  const vehicles = estate.vehicles.map((el) => initialMapper<EstateAsset>(el))
  const guns = estate.guns.map((el) => initialMapper<EstateAsset>(el))

  return {
    ...estate,
    realEstate: {
      data: realEstate,
    },
    vehicles: {
      data: vehicles,
    },
    guns: {
      data: guns,
    },
  }
}
