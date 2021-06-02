const BOOLEAN_TRUE = 'yes'
const BOOLEAN_FALSE = 'no'

export const formConstants = {
  boolean: {
    true: BOOLEAN_TRUE,
    false: BOOLEAN_FALSE,
  },
  spouseSelection: {
    spouse: 'spouse',
    manual: 'manual',
    noSpouse: BOOLEAN_FALSE,
  },
}

export const apiConstants = {
  pensionFunds: {
    // Id used when applicant does not wish to pay into a private pension fund
    noPrivatePensionFundId: 'X000',
  },
  attachments: {
    selfEmployed: 'selfEmployed',
  },
}
