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
        intro
        applicationDeadlineFrom
        applicationDeadlineTo
        institutionName
        locationTitle
        locationPostalCode
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
        intro
        description
        salaryTerms
        applicationDeadlineFrom
        applicationDeadlineTo
        institutionName
        locationTitle
        locationPostalCode
        logoUrl
        postalAddress
        address
        jobPercentage
        applicationHref
        qualificationRequirements
        contacts {
          name
          email
        }
      }
    }
  }
`
