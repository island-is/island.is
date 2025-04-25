import { getValueViaPath } from '@island.is/application/core'
import {
  ExamCategoriesAndInstructors,
  Examinees,
  ExamLocation,
  Instructors,
  PaymentArrangement,
} from '@island.is/application/templates/aosh/practical-exam'
import { FormValue } from '@island.is/application/types'

export type CategoryAndInstructorRequest = {
  instructorNationalId: string
  examCategory: string
}

enum IndividualOrCompany {
  individual = 'individual',
  company = 'company',
}

export type InstructorRequest = {
  nationalId: string
  email: string
  name: string
}

export type PaymentInfoRequest = {
  payerNationalId: string
  payerName: string
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

export const mapCategoriesWithInstructor = (
  examCategories: ExamCategoriesAndInstructors[],
): CategoryAndInstructorRequest[][] => {
  return examCategories.map((object, index) => {
    return object.categories.map((category, idx) => {
      return {
        examCategory: category.value,
        instructorNationalId: object.instructor[idx].value,
      }
    })
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
    }
  })
}

export const mapPaymentArrangement = (
  paymentArrengement: PaymentArrangement,
): PaymentInfoRequest | undefined => {
  if (
    paymentArrengement.individualOrCompany === IndividualOrCompany.individual ||
    paymentArrengement.paymentOptions === PaymentOptions.putIntoAccount
  )
    return undefined

  return {
    payerNationalId: paymentArrengement.companyInfo?.nationalId || '',
    payerName: paymentArrengement.companyInfo?.name || '',
    directPaymentId: '', // TODO ??
    textToDisplayOnInvoice: paymentArrengement.explanation || '',
  }
}

export const mapExaminees = (
  examinees: Examinees,
  examCategories: CategoryAndInstructorRequest[][],
): ExamineesRequest[] | undefined => {
  return examinees.map((examinee, index) => {
    const { nationalId, email, phone, countryIssuer, licenseNumber } = examinee
    return {
      name: nationalId.name,
      nationalId: nationalId.nationalId,
      drivingLicenseNumber: licenseNumber || '',
      drivingLicenseCountryOfOrigin: countryIssuer,
      medicalCertificate: {
        content: '',
        fileName: '',
        fileType: '',
      },
      email: email,
      phoneNumber: phone,
      examCategories: examCategories[index],
    }
  })
}
