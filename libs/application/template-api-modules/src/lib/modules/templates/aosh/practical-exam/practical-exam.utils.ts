import { getValueViaPath } from '@island.is/application/core'
import {
  ExamCategoriesAndInstructors,
  Examinees,
  ExamLocation,
  Instructors,
  PaymentArrangement,
  Information,
} from '@island.is/application/templates/aosh/practical-exam'
import { FormValue } from '@island.is/application/types'

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

enum IndividualOrCompany {
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

export const getExamLocation = (
  answers: FormValue,
): ExamLocation | undefined => {
  return getValueViaPath<ExamLocation>(answers, 'examLocation')
}

export const getExaminees = (answers: FormValue): Examinees | undefined => {
  return getValueViaPath<Examinees>(answers, 'examinees')
}

export const getExamcategories = (
  answers: FormValue,
): ExamCategoriesAndInstructors[] | undefined => {
  return getValueViaPath<ExamCategoriesAndInstructors[]>(
    answers,
    'examCategories',
  )
}

export const getInstructors = (answers: FormValue): Instructors | undefined => {
  return getValueViaPath<Instructors>(answers, 'instructors')
}

export const getPaymentArrangement = (
  answers: FormValue,
): PaymentArrangement | undefined => {
  return getValueViaPath<PaymentArrangement>(answers, 'paymentArrangement')
}

export const getInformation = (answers: FormValue): Information | undefined => {
  return getValueViaPath<Information>(answers, 'information')
}

export const mapCategoriesWithInstructor = (
  examCategories: ExamCategoriesAndInstructors[],
): CategoryInstructorAndMedicalCertRequest[] => {
  return examCategories.map((object, index) => {
    const catAndInstructor = object.categories.map((category, idx) => {
      return {
        examCategory: category.value,
        instructorNationalId: object.instructor[idx].value,
      }
    })

    const type = examCategories[index]?.medicalCertificate?.type || ''
    const name = examCategories[index]?.medicalCertificate?.name || ''
    const content = examCategories[index]?.medicalCertificate?.content || ''
    return {
      categoriesAndInstructors: catAndInstructor || [],
      medicalCertificate: {
        fileType: type || '',
        fileName: name || '',
        content: content || '',
      },
    }
  })
}

export const mapInstructors = (
  instructors: Instructors,
): InstructorRequest[] => {
  return instructors.map((instructor) => {
    return {
      nationalId: instructor.nationalId.nationalId,
      email: instructor.email,
      name: instructor.nationalId.name,
      phoneNumber: instructor.phone,
    }
  })
}

export const mapPaymentArrangement = (
  paymentArrangement: PaymentArrangement,
  information: Information,
  chargeId: string,
): PaymentInfoRequest | undefined => {
  const isIndividual =
    paymentArrangement.individualOrCompany === IndividualOrCompany.individual
  const isCashOnDelivery =
    paymentArrangement.paymentOptions === PaymentOptions.cashOnDelivery

  if (isIndividual) {
    return {
      payerNationalId: information.nationalId || '',
      payerName: information.name || '',
      payerEmail: information.email || '',
      directPaymentId: chargeId,
      textToDisplayOnInvoice: '',
    }
  }

  const companyInfo = paymentArrangement.companyInfo || {}
  const contactInfo = paymentArrangement.contactInfo || {}

  return {
    payerNationalId: companyInfo.nationalId || '',
    payerName: companyInfo.name || '',
    payerEmail: contactInfo.email || '',
    directPaymentId: isCashOnDelivery ? chargeId : '',
    textToDisplayOnInvoice: paymentArrangement.explanation || '',
  }
}

export const mapExaminees = (
  examinees: Examinees,
  examCategories: CategoryInstructorAndMedicalCertRequest[],
): ExamineesRequest[] | undefined => {
  return examinees.map((examinee, index) => {
    const { nationalId, email, phone, countryIssuer, licenseNumber } = examinee
    return {
      name: nationalId.name,
      nationalId: nationalId.nationalId,
      drivingLicenseNumber: licenseNumber || '',
      drivingLicenseCountryOfOrigin: countryIssuer,
      medicalCertificate: examCategories[index].medicalCertificate,
      email: email,
      phoneNumber: phone,
      examCategories: examCategories[index].categoriesAndInstructors,
    }
  })
}
