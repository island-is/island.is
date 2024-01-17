import gql from 'graphql-tag'

export const GET_CMS_VACANCIES = gql`
  query GetCmsVacancies($input: CmsVacanciesInput!) {
    cmsVacancies(input: $input) {
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

export const GET_EXTERNAL_VACANCIES = gql`
  query GetExternalVacancies($input: ExternalVacanciesInput!) {
    externalVacancies(input: $input) {
      input {
        page
        query
        fieldOfWork
        institution
        location
      }
      total
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

export const GET_EXTERNAL_VACANCY_INSTITUTIONS = gql`
  query GetExternalVacancyInstitutions {
    externalVacancyInstitutions {
      options {
        label
        value
      }
    }
  }
`

export const GET_EXTERNAL_VACANCY_FIELDS_OF_WORK = gql`
  query GetExternalVacancyFieldsOfWork {
    externalVacancyFieldsOfWork {
      options {
        label
        value
      }
    }
  }
`

export const GET_EXTERNAL_VACANCY_LOCATIONS = gql`
  query GetExternalVacancyLocations {
    externalVacancyLocations {
      options {
        label
        value
      }
    }
  }
`

export const GET_VACANCY_DETAILS = gql`
  query GetVacancyById($input: VacancyByIdInput!) {
    vacancy(input: $input) {
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
        }
      }
    }
  }
`
