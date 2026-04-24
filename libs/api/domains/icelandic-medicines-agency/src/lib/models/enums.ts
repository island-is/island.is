import { registerEnumType } from '@nestjs/graphql'

export enum IcelandicMedicinesAgencyPharmacyRegion {
  HOFUDBORGARSVAEDID = 'hofudborgarsvaedid',
  SUDURLAND_OG_REYKJANES = 'sudurlandOgReykjanes',
  VESTURLAND_OG_VESTFIRDIR = 'vesturlandOgVestfirdir',
  NORDURLAND = 'nordurland',
  AUSTURLAND = 'austurland',
}

registerEnumType(IcelandicMedicinesAgencyPharmacyRegion, {
  name: 'IcelandicMedicinesAgencyPharmacyRegion',
})
