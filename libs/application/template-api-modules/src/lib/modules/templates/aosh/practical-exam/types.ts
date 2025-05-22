export type CategoryAndInstructorRequest = {
  instructorNationalId: string
  examCategory: string
}

export type CategoryInstructorAndMedicalCertRequest = {
  categoriesAndInstructors: CategoryAndInstructorRequest[]
  medicalCertificate: {
    content: string
    fileName: string
    fileType: string
  }
}

export enum IndividualOrCompany {
  individual = 'individual',
  company = 'company',
}

export type InstructorRequest = {
  nationalId: string
  email: string
  name: string
  phoneNumber: string
}

export type PaymentInfoRequest = {
  payerNationalId: string
  payerName: string
  payerEmail: string
  directPaymentId: string
  textToDisplayOnInvoice: string
}

export enum PaymentOptions {
  cashOnDelivery = 'cashOnDelivery',
  putIntoAccount = 'putIntoAccount',
}
export type ExamineesRequest = {
  name: string
  nationalId: string
  email: string
  phoneNumber: string
  drivingLicenseNumber: string
  drivingLicenseCountryOfOrigin: string
  medicalCertificate: {
    content: string
    fileName: string
    fileType: string
  }
  examCategories: {
    examCategory: string
    instructorNationalId: string
  }[]
}
