import {
  EstateAsset,
  EstateInfo,
} from '@island.is/clients/syslumenn'
import { infer as zinfer } from 'zod'
import { inheritanceReportSchema } from '@island.is/application/templates/inheritance-report'
import { filterEmptyObjects } from './filters'

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

export const trueOrHasYes = (element: string | boolean): string => {
  const elementString = element.toString().toLowerCase()
  const value = elementString === 'yes' || elementString === 'true'
  return value.toString()
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

// -----------------------------------------------------------------
// ----------------------- EXPANDERS -------------------------------
// -----------------------------------------------------------------
// Optional properties do not appear as part of the data entry object
// When coming from the frontend.
// For processing on their end, the district commissioner requires that
// we maximally expand everything to include the same properties but with
// some sensible defaults on missing properties.
// Therefore we just expand these properties according to the schema specifications.

