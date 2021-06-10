import { gql } from '@apollo/client'

export const GetApplicantyQuery = gql`
  query GetApplicantyQuery($input: ApplicationInput!) {
    application(input: $input) {
      id
      nationalId
      created
      modified
      name
      phoneNumber
      email
      homeCircumstances
      student
      employment
      hasIncome
      usePersonalTaxCredit
      bankNumber
      ledger
      accountNumber
      interview
      employmentCustom
      homeCircumstancesCustom
    }
  }
`
