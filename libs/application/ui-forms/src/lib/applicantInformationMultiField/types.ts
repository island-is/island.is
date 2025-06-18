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
  applicantInformationTitle?: FormText
  applicantInformationDescription?: FormText
  baseInfoReadOnly?: boolean
  emailAndPhoneReadOnly?: boolean
  compactFields?: boolean
  customAddressLabel?: StaticText
  customPostalCodeAndCityLabel?: StaticText
}
