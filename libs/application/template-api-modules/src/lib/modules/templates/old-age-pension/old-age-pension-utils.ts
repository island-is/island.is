import { Application, YES } from '@island.is/application/types'

import { getApplicationAnswers } from '@island.is/application/templates/old-age-pension'

export const transformApplicationToOldAgePensionDTO = (
  application: Application,
  uploads: any
): any => {
  const {
    pensionFundQuestion,
    applicationType,
    selectedYear,
    selectedMonth,
    applicantEmail,
    applicantPhonenumber,
    bank,
    residenceHistoryQuestion,
    onePaymentPerYear,
    comment,
    connectedApplications,
    householdSupplementHousing,
    householdSupplementChildren,
    employmentStatus,
    employers,
    rawEmployers,
    childPensionSelectedCustodyKids,
    childPensionAddChild,
    childPension,
    personalAllowance,
    spouseAllowance,
    personalAllowanceUsage,
    spouseAllowanceUsage,
    taxLevel,
  } = getApplicationAnswers(application.answers)



    console.log('?????????????  Data that dont have any parameters to map to, yet ???????????????')
 
    console.log('employmentStatus',employmentStatus)
    console.log('employers',employers)
    console.log('rawEmployers',rawEmployers)
    console.log('childPensionSelectedCustodyKids',childPensionSelectedCustodyKids)
    console.log('childPensionAddChild',childPensionAddChild)
    console.log('childPension',childPension)
    console.log('application',application)
    console.log('application.application', application.applicant)


    const childrens = childPension

  return {
    period: {
      year: selectedYear,
      month: selectedMonth, // TODO:
    },
    comment: comment,
    pensionFund: YES === pensionFundQuestion,
    paymentInfo: {
      bank: bank,
      taxLevel: taxLevel,
      spouseAllowance: YES === spouseAllowance,
      personalAllowance: YES === personalAllowance,
      spouseAllowanceUsage: spouseAllowanceUsage,
      personalAllowanceUsage: personalAllowanceUsage,
    },
    applicantInfo: application.answers.applicantInfo,
    applicationType: applicationType,
    hasAbroadResidence: YES === residenceHistoryQuestion,
    hasOneTimePayment: YES === onePaymentPerYear,
    isSailorPension: true, // TODO:
    householdSupplement: {
      isRental: householdSupplementHousing !== 'houseOwner',
      childrenUnder18: YES === householdSupplementChildren,
    },
    children: childrens,
    connectedApplications: connectedApplications,
    uploads
  }
}
