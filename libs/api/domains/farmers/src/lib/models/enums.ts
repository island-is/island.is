import { registerEnumType } from '@nestjs/graphql'

export enum FarmerLandSubsidyOrderField {
  Contract = 'contract',
  PaymentCategory = 'paymentCategory',
  PaymentDate = 'paymentDate',
}

export enum FarmerLandSubsidyOrderDirection {
  Ascending = 'Ascending',
  Descending = 'Descending',
}

registerEnumType(FarmerLandSubsidyOrderField, {
  name: 'FarmerLandSubsidyOrderField',
})
registerEnumType(FarmerLandSubsidyOrderDirection, {
  name: 'FarmerLandSubsidyOrderDirection',
})
