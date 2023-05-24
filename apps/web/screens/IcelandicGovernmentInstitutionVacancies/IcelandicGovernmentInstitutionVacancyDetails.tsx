import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetIcelandicGovernmentInstitutionVacancyDetailsQuery,
  GetIcelandicGovernmentInstitutionVacancyDetailsQueryVariables,
  IcelandicGovernmentInstitutionVacancyByIdResponse,
} from '@island.is/web/graphql/schema'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCY_DETAILS } from '../queries/IcelandicGovernmentInstitutionVacancies'
import { Text, FocusableBox } from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'

interface IcelandicGovernmentInstitutionVacancyDetailsProps {
  vacancy: IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']
}

const IcelandicGovernmentInstitutionVacancyDetails: Screen<IcelandicGovernmentInstitutionVacancyDetailsProps> = ({
  vacancy,
}) => {
  const { linkResolver } = useLinkResolver()
  console.log(vacancy)
  return (
    <FocusableBox
      key={vacancy.id}
      href={`${linkResolver('vacancydetails', [vacancy.id?.toString()]).href}`}
      padding="containerGutter"
      display="flex"
      flexDirection="column"
      background="white"
      borderRadius="large"
      borderColor="blue200"
      borderWidth="standard"
    >
      <Text variant="eyebrow">{vacancy.fieldOfWork}</Text>
      <Text color="blue400" variant="h3">
        {vacancy.title}
      </Text>
      <div dangerouslySetInnerHTML={{ __html: vacancy.description }}></div>
    </FocusableBox>
  )
}

IcelandicGovernmentInstitutionVacancyDetails.getInitialProps = async ({
  apolloClient,
  query,
}) => {
  if (!query?.id || isNaN(Number(query?.id))) {
    throw new CustomNextError(404, 'Vacancy was not found')
  }

  const vacancyResponse = await apolloClient.query<
    GetIcelandicGovernmentInstitutionVacancyDetailsQuery,
    GetIcelandicGovernmentInstitutionVacancyDetailsQueryVariables
  >({
    query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCY_DETAILS,
    variables: {
      input: {
        id: Number(query.id),
      },
    },
  })

  if (
    !vacancyResponse?.data?.icelandicGovernmentInstitutionVacancyById?.vacancy
  ) {
    throw new CustomNextError(404, 'Vacancy was not found')
  }

  return {
    vacancy:
      vacancyResponse.data.icelandicGovernmentInstitutionVacancyById.vacancy,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacancyDetails)
