import { registerEnumType } from '@nestjs/graphql'

export enum IcelandicMedicinesAgencyPharmacyRegion {
  HOFUDBORGARSVAEDID = 'HOFUDBORGARSVAEDID',
  SUDURLAND_OG_REYKJANES = 'SUDURLAND_OG_REYKJANES',
  VESTURLAND_OG_VESTFIRDIR = 'VESTURLAND_OG_VESTFIRDIR',
  NORDURLAND = 'NORDURLAND',
  AUSTURLAND = 'AUSTURLAND',
}

registerEnumType(IcelandicMedicinesAgencyPharmacyRegion, {
  name: 'IcelandicMedicinesAgencyPharmacyRegion',
})
