import gql from 'graphql-tag'

export const GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES = gql`
  query GetIcelandicGovernmentInstitutionVacancies(
    $input: IcelandicGovernmentInstitutionVacanciesInput!
  ) {
    icelandicGovernmentInstitutionVacancies(input: $input) {
      fetchErrorOccurred
      vacancies {
        id
        fieldOfWork
        title
        intro
        applicationDeadlineFrom
        applicationDeadlineTo
        institutionName
        logoUrl
        locations {
          title
          postalCode
        }
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
        logoUrl
        jobPercentage
        applicationHref
        qualificationRequirements
        tasksAndResponsibilities
        plainTextIntro
        locations {
          title
          postalCode
        }
        contacts {
          name
          email
          phone
          jobTitle
        }
      }
    }
  }
`
