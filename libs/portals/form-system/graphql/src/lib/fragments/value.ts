import { gql } from '@apollo/client'

export const ValueFragment = gql`
  fragment Value on FormSystemValue {
    text
    number
    date
    kennitala
    name
    address
    postalCode
    municipality
    jobTitle
    altName
    homestayNumber
    totalDays
    totalAmount
    year
    isNullReport
    months {
      month
      amount
      days
    }
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
