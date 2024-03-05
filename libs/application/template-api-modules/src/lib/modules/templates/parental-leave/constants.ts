export const apiConstants = {
  actualDateOfBirth: 'date_of_birth',
  actualDateOfBirthMonths: 'date_of_birth_months',
  pensionFunds: {
    // Id used when applicant does not wish to pay into a private pension fund
    noPrivatePensionFundId: 'X000',
    noPensionFundId: 'L000',
  },
  unions: {
    noUnion: 'F000',
  },
  rights: {
    // When primary or secondary parents are requested extra days from their spouse
    receivingRightsId: 'FSAL-GR',
    multipleBirthsOrlofRightsId: 'ORLOF-FBF',
    multipleBirthsGrantRightsId: 'ST-FBF',
    artificialInseminationRightsId: 'EITTFOR',
  },
  attachments: {
    selfEmployed: 'selfEmployed',
    student: 'Student',
    unEmploymentBenefits: 'UnemploymentBenefits',
    other: 'Other',
    artificialInsemination: 'ArtificialInsemination',
    parentWithoutBirthParent: 'ParentWithoutBirthParent',
    permanentFosterCare: 'PermanentFosterCare',
    adoption: 'Adoption',
    residenceGrant: 'ResidenceGrant',
    employmentTerminationCertificate: 'EmploymentTerminationCertificate',
  },
}

export const isRunningInProduction = process.env.NODE_ENV === 'production'

export const APPLICATION_ATTACHMENT_BUCKET = 'APPLICATION_ATTACHMENT_BUCKET'
export const SIX_MONTHS_IN_SECONDS_EXPIRES = 6 * 30 * 24 * 60 * 60
export const df = 'yyyy-MM-dd'
