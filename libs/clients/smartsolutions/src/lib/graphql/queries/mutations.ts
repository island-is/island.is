export const VOID_PASS = `
  mutation VoidPass($id: String!) {
    voidPass(id: $id)
  }
`

export const UNVOID_PASS = `
  mutation UnvoidPass($id: String!) {
    unvoidPass(id: $id)
  }
`

export const DELETE_PASS = `
  mutation DeletePass($id: String!) {
    deletePass(id: $id)
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
    }
  }
`
