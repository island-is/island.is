import { FormText } from '@island.is/application/types'
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
  phoneRequired?: boolean
  emailRequired?: boolean
  emailDisabled?: boolean
  applicantInformationDescription?: FormText
  readOnly?: boolean
}
