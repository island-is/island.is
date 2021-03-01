import { gql } from '@apollo/client'
import { CurrentUserCompanies } from 'libs/api/schema/src'

export type GetUserCompaniesResponse = {
  rskGetCurrentUserCompanies: Pick<
    CurrentUserCompanies,
    'Kennitala' | 'Nafn' | 'ErProkuruhafi'
  >[]
}

export const GetUserCompaniesQuery = gql`
  query GetUserCompanies {
    rskGetCurrentUserCompanies {
      Kennitala
      Nafn
      ErProkuruhafi
    }
  }
`
