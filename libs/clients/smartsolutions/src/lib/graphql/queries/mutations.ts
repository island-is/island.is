export const VOID_PASS = `
  mutation VoidPass($passTemplateId: String!, $values: [PassInputFieldValueDataInput!]! ) {
    voidUniquePass(passTemplateId: $passTemplateId, values: $values )
  }
`

export const UNVOID_PASS = `
  mutation UnvoidPass($id: String!) {
    unvoidPass(id: $id)
  }
`

export const DELETE_PASS = `
  mutation DeletePass($passTemplateId: String!, $values: [PassInputFieldValueDataInput!]! ) {
    deleteUniquePass(passTemplateId: $passTemplateId, values: $values)
  }
`

export const VERIFY_PKPASS = `
  mutation UpdateStatusOnPassWithDynamicBarcode($dynamicBarcodeData: DynamicBarcodeDataInput!) {
    updateStatusOnPassWithDynamicBarcode(dynamicBarcodeData: $dynamicBarcodeData) {
      status
      inputFieldValues {
        passInputField {
          identifier
        }
        value
      }
    }
  }
`

export const UPSERT_PASS = `
  mutation UpsertPass($inputData: PassDataInput!) {
    upsertPass(data: $inputData) {
      distributionUrl
      deliveryPageUrl
      distributionQRCode
      id
      expirationDate
      whenCreated
      whenModified
    }
  }
`

export const UPDATE_PASS = `
  mutation UPDATE_PASS($passTemplateId: String!, $expirationDate: String, $thumbnail: ImageDataInput, $values: [PassInputFieldValueDataInput!] ) {
    updatePass(
      expirationDate: $expirationDate
      passTemplateId: $passTemplateId
      thumbnail: $thumbnail
      values: $values
    ) {
      distributionUrl
      deliveryPageUrl
      distributionQRCode
      id
      expirationDate
      whenCreated
      whenModified
    }
  }
`
