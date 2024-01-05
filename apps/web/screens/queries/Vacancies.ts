import gql from 'graphql-tag'

export const GET_VACANCIES = gql`
  query GetVacancies($input: VacanciesInput!) {
    vacancies(input: $input) {
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

export const GET_VACANCY_DETAILS = gql`
  query GetVacancyByIdQuery($input: VacancyByIdInput!) {
    vacancyById(input: $input) {
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
