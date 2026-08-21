import { MessageDescriptor } from 'react-intl'

import { IcelandicMedicinesAgencyPharmacyRegion } from '@island.is/web/graphql/schema'

import { m as pharmacyStrings } from './translation.strings'

export const REGION_LABEL_MAP: Record<
  IcelandicMedicinesAgencyPharmacyRegion,
  MessageDescriptor
> = {
  [IcelandicMedicinesAgencyPharmacyRegion.Hofudborgarsvaedid]:
    pharmacyStrings.regionCapital,
  [IcelandicMedicinesAgencyPharmacyRegion.SudurlandOgReykjanes]:
    pharmacyStrings.regionSouth,
  [IcelandicMedicinesAgencyPharmacyRegion.VesturlandOgVestfirdir]:
    pharmacyStrings.regionWest,
  [IcelandicMedicinesAgencyPharmacyRegion.Nordurland]:
    pharmacyStrings.regionNorth,
  [IcelandicMedicinesAgencyPharmacyRegion.Austurland]:
    pharmacyStrings.regionEast,
}
