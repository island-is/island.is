import { Condition, FormText, StaticText } from '@island.is/application/types'
export interface ApplicantInformationInterface {
  externalData: {
    // new dataprovider
    identity: {
      data: {
        name: 'string'
        nationalId: 'string'
        address: {
          streetAddress: 'string'
          postalCode: 'string'
          city: 'string'
        }
      }
    }
    // old dataprovider, will be replaced soon by the other one
    nationalRegistry: {
      data: {
        fullName: 'string'
        nationalId: 'string'
        address: {
          streetAddress: 'string'
          postalCode: 'string'
          city: 'string'
        }
      }
    }
    // user profile
    userProfile?: {
      data?: {
        email?: string
        mobilePhoneNumber?: string
        /** From UserProfile API / FJS, e.g. `0515-23-012841` */
        bankInfo?: string
      }
    }
  }
}

export type applicantInformationProps = {
  phoneCondition?: Condition
  phoneRequired?: boolean
  phoneDisabled?: boolean
  phoneEnableCountrySelector?: boolean
  emailCondition?: Condition
  emailRequired?: boolean
  emailDisabled?: boolean
  addressRequired?: boolean
  postalCodeRequired?: boolean
  cityRequired?: boolean
  applicantInformationTitle?: FormText
  applicantInformationDescription?: FormText
  baseInfoReadOnly?: boolean
  emailAndPhoneReadOnly?: boolean
  /**
   * When true and `emailAndPhoneReadOnly` is enabled, the phone field becomes
   * editable if the user profile does not contain a phone number. Useful for
   * flows where applicants with only a foreign number (not stored in the user
   * profile) still need to be able to enter one.
   */
  makePhoneEditableIfMissing?: boolean
  compactFields?: boolean
  customAddressLabel?: StaticText
  customPostalCodeAndCityLabel?: StaticText
  /** When true, adds `applicant.bankAccount` (bank / ledger / account) after phone. */
  includeBankAccount?: boolean
  bankAccountRequired?: boolean
  bankAccountCondition?: Condition
  bankAccountTitle?: FormText
}
