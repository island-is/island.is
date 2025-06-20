import { getValueViaPath } from '@island.is/application/core'
import {
  ExamCategoriesAndInstructors,
  Examinees,
  ExamLocation,
  Instructors,
  PaymentArrangement,
  Information,
  shared,
} from '@island.is/application/templates/aosh/practical-exam'
import { FormValue } from '@island.is/application/types'
import {
  CategoryInstructorAndMedicalCertRequest,
  ExamineesRequest,
  IndividualOrCompany,
  InstructorRequest,
  PaymentInfoRequest,
  PaymentOptions,
} from './types'
import { TemplateApiError } from '@island.is/nest/problem'

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

    const type =
      examCategories[index]?.medicalCertificate?.[0]?.key.split('.')[1] || ''
    const name = examCategories[index]?.medicalCertificate?.[0]?.name || ''
    const content = examCategories[index]?.medicalCertificate?.[0]?.key || ''

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
  paymentArrangement: PaymentArrangement | undefined,
  information: Information,
  chargeId: string,
): PaymentInfoRequest | undefined => {
  const isIndividual =
    paymentArrangement?.individualOrCompany === IndividualOrCompany.individual
  const isCashOnDelivery =
    paymentArrangement?.paymentOptions === PaymentOptions.cashOnDelivery

  if (isIndividual || !paymentArrangement) {
    if (!chargeId) {
      throw new TemplateApiError(
        {
          summary: shared.application.chargeCodeMissing,
          title: shared.application.submissionErrorTitle,
        },
        400,
      )
    }

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
): ExamineesRequest[] => {
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
