export interface Applicant {
  nationalId: string
  name: string
  phoneNumber: string
  email: string
  postalCode: number
  drivingLicenseNumber: string
}

export interface Company {
  companyName: string
  companyNationalId: string
  contactNationalId: string
  contactName: string
  contactPhoneNumber: string
  contactEmail: string
  machineRegistrationNumbers: string[]
}

export interface CertificateOfTenure {
  machineRegistrationNumber: string
  machineType: string
  dateWorkedOnMachineFrom: Date
  dateWorkedOnMachineTo: Date
  hoursWorkedOnMachine: number
}

export interface EmailRecipient {
  ssn: string
  name: string
  email?: string
  phone?: string
}
