import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetIcelandicGovernmentInstitutionVacanciesQuery,
  GetIcelandicGovernmentInstitutionVacanciesQueryVariables,
  IcelandicGovernmentInstitutionVacanciesResponse,
} from '@island.is/web/graphql/schema'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES } from '../queries/IcelandicGovernmentInstitutionVacancies'
import {
  Text,
  FocusableBox,
  GridContainer,
  GridColumn,
  Box,
  GridRow,
} from '@island.is/island-ui/core'
import { useLinkResolver } from '@island.is/web/hooks'

interface IcelandicGovernmentInstitutionVacanciesListProps {
  vacancies: IcelandicGovernmentInstitutionVacanciesResponse['vacancies']
}

const IcelandicGovernmentInstitutionVacanciesList: Screen<IcelandicGovernmentInstitutionVacanciesListProps> = ({
  vacancies,
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <Box paddingBottom={6}>
      <GridContainer>
        <GridRow>
          {vacancies.map((vacancy) => (
            <GridColumn key={vacancy.id} span={['1/1', '1/1', '1/2']}>
              <FocusableBox
                href={`${
                  linkResolver('vacancydetails', [vacancy.id?.toString()]).href
                }`}
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
                <div
                  dangerouslySetInnerHTML={{
                    __html: vacancy.description?.slice(0, 80).concat('...'),
                  }}
                ></div>
              </FocusableBox>
            </GridColumn>
          ))}
        </GridRow>
      </GridContainer>
    </Box>
  )
}

IcelandicGovernmentInstitutionVacanciesList.getInitialProps = async ({
  apolloClient,
}) => {
  const vacanciesResponse = await apolloClient.query<
    GetIcelandicGovernmentInstitutionVacanciesQuery,
    GetIcelandicGovernmentInstitutionVacanciesQueryVariables
  >({
    query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES,
    variables: {
      input: {},
    },
  })

  return {
    vacancies:
      vacanciesResponse.data.icelandicGovernmentInstitutionVacancies.vacancies,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacanciesList)
