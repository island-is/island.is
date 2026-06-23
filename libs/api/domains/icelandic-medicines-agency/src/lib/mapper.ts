import {
  MedicalClinic,
  Pharmacy,
  Wholesaler,
} from '@island.is/clients/lyfjastofnun-pharmacies'

import { IcelandicMedicinesAgencyMedicalClinic } from './models/medicalClinic.model'
import { IcelandicMedicinesAgencyPharmacy } from './models/pharmacy.model'
import { IcelandicMedicinesAgencyWholesaler } from './models/wholesaler.model'
import { POSTAL_CODE_TO_REGION } from './postalCodeToRegion'

const regionFromPostalCode = (postalCode?: string) => {
  const code = postalCode ? parseInt(postalCode, 10) : NaN
  return isNaN(code) ? undefined : POSTAL_CODE_TO_REGION[code]
}

export const mapToPharmacy = (
  dto: Pharmacy,
): IcelandicMedicinesAgencyPharmacy => ({
  id: dto.name,
  name: dto.name,
  address: dto.address,
  postalCode: dto.postalCode,
  city: dto.city,
  phone: dto.phone,
  fax: dto.fax,
  email: dto.email,
  licenseHolder: dto.licenseHolder,
  region: regionFromPostalCode(dto.postalCode),
  operator: dto.operator,
  branches: dto.branches,
})

export const mapToMedicalClinic = (
  dto: MedicalClinic,
): IcelandicMedicinesAgencyMedicalClinic => ({
  id: dto.name,
  name: dto.name,
  address: dto.address,
  postalCode: dto.postalCode,
  city: dto.city,
  phone: dto.phone,
  fax: dto.fax,
  email: dto.email,
  region: regionFromPostalCode(dto.postalCode),
  operator: dto.operator,
})

export const mapToWholesaler = (
  dto: Wholesaler,
): IcelandicMedicinesAgencyWholesaler => ({
  id: dto.name,
  name: dto.name,
  address: dto.address,
  postalCode: dto.postalCode,
  city: dto.city,
  phone: dto.phone,
  fax: dto.fax,
  email: dto.email,
})
