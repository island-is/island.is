import gql from 'graphql-tag'

export const GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES = gql`
  query GetIcelandicGovernmentInstitutionVacancies(
    $input: IcelandicGovernmentInstitutionVacanciesInput!
  ) {
    icelandicGovernmentInstitutionVacancies(input: $input) {
      vacancies {
        id
        fieldOfWork
        title
        description
        applicationDeadlineFrom
        applicationDeadlineTo
        institutionName
        locations {
          postalCode
          title
        }
        logoUrl
      }
    }
  }
`

export const GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCY_DETAILS = gql`
  query GetIcelandicGovernmentInstitutionVacancyDetails(
    $input: IcelandicGovernmentInstitutionVacancyByIdInput!
  ) {
    icelandicGovernmentInstitutionVacancyById(input: $input) {
      vacancy {
        id
        fieldOfWork
        title
        description
        applicationDeadlineFrom
        applicationDeadlineTo
        institutionName
        locations {
          postalCode
          title
        }
        logoUrl
        postalAddress
        address
        jobPercentage
        contacts {
          name
          email
        }
      }
    }
  }
`
