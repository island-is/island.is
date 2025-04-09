export type CustomerChargeType = {
  chargeType?: CustomerChargeTypeItem[]
}

export type CustomerChargeTypeItem = {
  id: string
  name: string
}

export type CustomerRecords = {
  records?: CustomerRecordsDetails[]
}

export type CustomerRecordsDetails = {
  createDate: string
  createTime: string
  valueDate: string
  performingOrganization: string
  collectingOrganization: string
  chargeType: string
  itemCode: string
  chargeItemSubject: string
  periodType: string
  period: string
  amount: number
  category: string
  subCategory: string
  actionCategory?: string
  reference: string
  referenceToLevy: string
  accountReference: string
}
