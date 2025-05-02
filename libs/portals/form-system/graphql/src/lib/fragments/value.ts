import { gql } from '@apollo/client'

export const ValueFragment = gql`
  fragment Value on FormSystemValue {
    text
    number
    date
    nationalId
    name
    address
    postalCode
    municipality
    jobTitle
    altName
    homestayNumber
    propertyNumber
    totalDays
    totalAmount
    year
    isNullReport
    months {
      month
      amount
      days
    }
    listValue
    email
    iskNumber
    checkboxValue
    phoneNumber
    bankAccount
    time
    s3Key
  }
`

export const ValueDtoFragment = gql`
  fragment ValueDto on FormSystemValueDto {
    id
    order
    json {
      ...Value
    }
  }
  ${ValueFragment}
`
