import { gql } from '@apollo/client'

export const GET_CUSTOMER_RECORDS = gql`
  query GetCustomerRecordsQuery($input: GetCustomerRecordsInput!) {
    getCustomerRecords(input: $input) {
      records {
        createDate
        createTime
        valueDate
        performingOrganization
        collectingOrganization
        chargeType
        itemCode
        chargeItemSubject
        periodType
        period
        amount
        category
        subCategory
        actionCategory
        reference
        referenceToLevy
        accountReference
      }
    }
  }
`
