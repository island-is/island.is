import {
  Lyfjabud,
  LyfjaUtibu,
} from '@island.is/clients/lyfjastofnun-pharmacies'

import { IcelandicMedicinesAgencyPharmacy } from './models/pharmacy.model'
import { IcelandicMedicinesAgencyPharmacyBranch } from './models/pharmacyBranch.model'

const mapToPharmacyBranch = (
  dto: LyfjaUtibu,
): IcelandicMedicinesAgencyPharmacyBranch | undefined => {
  if (!dto.nafn) {
    return undefined
  }

  return {
    name: dto.nafn,
    address: dto.gotuheiti ?? undefined,
    postalCode: dto.postnumer ?? undefined,
    city: dto.poststod ?? undefined,
    phone: dto.simi ?? undefined,
    fax: dto.fax ?? undefined,
    email: dto.netfang ?? undefined,
    category: dto.flokkur ?? undefined,
  }
}

export const mapToPharmacy = (
  dto: Lyfjabud,
): IcelandicMedicinesAgencyPharmacy | undefined => {
  if (!dto.kennitala || !dto.nafn) {
    return undefined
  }

  return {
    id: dto.nafn,
    name: dto.nafn,
    address: dto.gotuheiti1 ?? undefined,
    postalCode: dto.postnumer ?? undefined,
    city: dto.poststod ?? undefined,
    phone: dto.simi ?? undefined,
    fax: dto.fax ?? undefined,
    email: dto.netfang ?? undefined,
    licenseHolder: dto.lyfsoluleyfishafi ?? undefined,
    operator: dto.rekstraradili
      ? {
          name: dto.rekstraradili,
          address: dto.rek_Gotuheiti1 ?? undefined,
          postalCode: dto.rek_Postnumer ?? undefined,
          city: dto.rek_Poststod ?? undefined,
          phone: dto.rek_Simi ?? undefined,
          nationalId: dto.rek_Kennitala ?? undefined,
        }
      : undefined,
    branches: (dto.utibu ?? [])
      .map(mapToPharmacyBranch)
      .filter(
        (b): b is IcelandicMedicinesAgencyPharmacyBranch => b !== undefined,
      ),
  }
}
