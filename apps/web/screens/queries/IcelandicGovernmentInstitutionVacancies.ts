import gql from 'graphql-tag'

export const GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES = gql`
  query GetIcelandicGovernmentInstitutionVacancies(
    $input: IcelandicGovernmentInstitutionVacanciesInput!
  ) {
    icelandicGovernmentInstitutionVacancies(input: $input) {
      test
    }
  }
`
