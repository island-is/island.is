import { ConnectedComponent, IcelandicMedicinesAgencyPharmacyRegion } from '@island.is/web/graphql/schema'

export type Datasource = 'pharmacies' | 'medicalClinics' | 'wholesalers'

export const isDatasource = (v: unknown): v is Datasource =>
  v === 'pharmacies' || v === 'medicalClinics' || v === 'wholesalers'

export type Item = {
  id: string
  name: string
  address?: string | null
  postalCode?: string | null
  city?: string | null
  phone?: string | null
  fax?: string | null
  email?: string | null
  licenseHolder?: string | null
  region?: IcelandicMedicinesAgencyPharmacyRegion | null
  operator?: {
    name: string
    address?: string | null
    postalCode?: string | null
    city?: string | null
    phone?: string | null
    nationalId?: string | null
  } | null
  branches?: Array<{
    name: string
    address?: string | null
    postalCode?: string | null
    city?: string | null
    phone?: string | null
    fax?: string | null
    email?: string | null
    category?: string | null
  }> | null
}

export interface Props {
  slice: ConnectedComponent
}
