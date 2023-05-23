import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetIcelandicGovernmentInstitutionVacanciesQuery,
  GetIcelandicGovernmentInstitutionVacanciesQueryVariables,
  VacanciesGetLanguageEnum,
} from '@island.is/web/graphql/schema'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES } from '../queries/IcelandicGovernmentInstitutionVacancies'

interface IcelandicGovernmentInstitutionVacanciesListProps {
  vacancies: any
}

const IcelandicGovernmentInstitutionVacanciesList: Screen<IcelandicGovernmentInstitutionVacanciesListProps> = ({
  vacancies,
}) => {
  return <div>{JSON.stringify(vacancies)}</div>
}

IcelandicGovernmentInstitutionVacanciesList.getInitialProps = async ({
  apolloClient,
}) => {
  const a = await apolloClient.query<
    GetIcelandicGovernmentInstitutionVacanciesQuery,
    GetIcelandicGovernmentInstitutionVacanciesQueryVariables
  >({
    query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES,
    variables: {
      input: {
        language: VacanciesGetLanguageEnum.Is,
      },
    },
  })

  return {
    vacancies: a,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacanciesList)
