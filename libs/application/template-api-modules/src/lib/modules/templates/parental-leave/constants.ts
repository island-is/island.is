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
  maxDaysToGiveOrReceive: 45,
  pensionFunds: {
    // Id used when applicant does not wish to pay into a private pension fund
    noPrivatePensionFundId: 'X000',
  },
  rights: {
    // When primary or secondary parents are requested extra days from their spouse
    givingReceivingRightsId: 'FSAL-GR',
  },
  attachments: {
    selfEmployed: 'selfEmployed',
  },
}
