export interface PaymentServiceOptions {
    url: string
    username: string
    password: string
    key: number,
    organization: string,
  }
  
  export interface Charge {
    systemID: string,
    performingOrgID: string,
    payeeNationalID: string,
    chargeType: string,
    chargeItemSubject: string,
    performerNationalID: string,
    immediateProcess: boolean,
    charges: ChargeItem[]
    payInfo?: PayInfo,
  }
  
  export interface ChargeResponse {
    user4: string,
    receptionID: string,
    //createdTimeStamp: Date
  }
  
  interface ChargeItem {
    chargeItemCode: string,
    quantity: number,
    priceAmount: number,
    amount: number,
    reference: string,
  }
  
  interface PayInfo {
    RRN: string,
    cardType: string,
    paymentMeans: string,
    authCode: string,
    PAN: string,
    payableAmount: number
  }
  
  export interface Catalog {
    items: Item[],
    //createdTimeStamp: Date
  }
  
  interface Item {
    performingOrgID: string,
    chargeType: string,
    chargeItemCode: string,
    chargeItemName: string,
    priceAmount: number
  }
  
  // export interface XRoadConfig {
  //   baseUrl: string
  //   clientId: string
  //   services: {
  
  //   }
  // }