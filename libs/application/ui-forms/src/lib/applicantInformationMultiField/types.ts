export interface ApplicantInformationInterface {
  externalData: {
    // new dataprovider
    identityRegistry: {
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
  }
}

export type applicantInformationProps = {
  phoneRequired?: boolean
  emailRequired?: boolean
}
