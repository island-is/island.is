import { gql } from '@apollo/client'

export const GET_CHARGE_TYPE_PERIOD_SUBJECT = gql`
  query GetChargeTypePeriodSubject($input: GetChargeTypePeriodSubjectInput!) {
    getChargeTypePeriodSubject(input: $input) {
      message
      nextKey
      more
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
