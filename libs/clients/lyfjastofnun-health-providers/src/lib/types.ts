export interface LicensedOperationOperator {
  name: string
  address?: string
  postalCode?: string
  city?: string
  phone?: string
  nationalId?: string
}

export interface PharmacyBranch {
  name: string
  address?: string
  postalCode?: string
  city?: string
  phone?: string
  fax?: string
  email?: string
  category?: string
}

export interface Pharmacy {
  name: string
  address?: string
  postalCode?: string
  city?: string
  phone?: string
  fax?: string
  email?: string
  nationalId?: string
  licenseHolder?: string
  onlineStore?: string
  operator?: LicensedOperationOperator
  branches: PharmacyBranch[]
}

export interface MedicalClinic {
  name: string
  address?: string
  postalCode?: string
  city?: string
  phone?: string
  fax?: string
  email?: string
  nationalId?: string
  operator?: LicensedOperationOperator
}

export interface Wholesaler {
  name: string
  address?: string
  postalCode?: string
  city?: string
  phone?: string
  fax?: string
  email?: string
  nationalId?: string
}
