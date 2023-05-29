import ReactHtmlParser from 'react-html-parser'
import { Screen } from '@island.is/web/types'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  GetIcelandicGovernmentInstitutionVacancyDetailsQuery,
  GetIcelandicGovernmentInstitutionVacancyDetailsQueryVariables,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  IcelandicGovernmentInstitutionVacancyByIdResponse,
} from '@island.is/web/graphql/schema'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCY_DETAILS } from '../queries/IcelandicGovernmentInstitutionVacancies'
import {
  Text,
  Box,
  Stack,
  LinkV2,
  Icon,
  Breadcrumbs,
  Button,
  Inline,
} from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'
import SidebarLayout from '../Layouts/SidebarLayout'
import { InstitutionPanel } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '../queries'

type Vacancy = IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']

interface IcelandicGovernmentInstitutionVacancyDetailsProps {
  vacancy: Vacancy
  namespace: Record<string, string>
}

const IcelandicGovernmentInstitutionVacancyDetails: Screen<IcelandicGovernmentInstitutionVacancyDetailsProps> = ({
  vacancy,
  namespace,
}) => {
  const { linkResolver } = useLinkResolver()
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)

  return (
    <SidebarLayout
      sidebarContent={
        <Stack space={3}>
          <LinkV2
            href={linkResolver('vacancies').href}
            underlineVisibility="always"
            underline="normal"
            color="blue400"
          >
            <Icon size="small" icon="arrowBack" />
            {n('goBack', 'Til baka')}
          </LinkV2>
          <InstitutionPanel
            img={vacancy.logoUrl}
            institutionTitle={n('institutionCardTitle', 'Þjónustuaðili')}
            institution={vacancy.institutionName}
            locale={activeLocale}
            imgContainerDisplay={['block', 'block', 'none', 'block']}
          />
          <Box background="dark100" borderRadius="large" padding={[3, 3, 4]}>
            <Stack space={3}>
              <Text variant="h4">
                {n('informationAboutJob', 'Upplýsingar um starf')}
              </Text>
              <Box borderTopWidth="standard" borderColor="dark200" />
              <Box>
                <Text fontWeight="semiBold">{n('fieldOfWork', 'Starf')}</Text>
                <Text variant="small">{vacancy.title}</Text>
              </Box>
              <Box>
                <Text fontWeight="semiBold">
                  {n('location', 'Staðsetning')}
                </Text>
                <Text variant="small">{vacancy.locationTitle}</Text>
              </Box>
              <Box>
                <Text fontWeight="semiBold">
                  {n('jobPercentage', 'Starfshlutfall')}
                </Text>
                <Text variant="small">{vacancy.jobPercentage}</Text>
              </Box>
              <Box>
                <Text fontWeight="semiBold">
                  {n('applicationDeadlineFrom', 'Starf skráð')}
                </Text>
                <Text variant="small">{vacancy.applicationDeadlineFrom}</Text>
              </Box>
              <Box>
                <Text fontWeight="semiBold">
                  {n('applicationDeadlineTo', 'Umsóknarfrestur')}
                </Text>
                <Text variant="small">{vacancy.applicationDeadlineTo}</Text>
              </Box>
            </Stack>
          </Box>
        </Stack>
      }
    >
      <Stack space={3}>
        <Breadcrumbs
          items={[
            { title: 'Ísland.is', href: '/' },
            {
              title: n('breadcrumbTitle', 'Starfatorg'),
              href: linkResolver('vacancies').href,
            },
            {
              title: vacancy.institutionName,
              href: linkResolver('vacancydetails', [vacancy.id.toString()])
                .href,
            },
          ]}
        />
        <Text variant="h1">{vacancy.title}</Text>
        <Text as="div">{ReactHtmlParser(vacancy.description)}</Text>

        {vacancy.applicationHref && (
          <Inline>
            <LinkV2 href={vacancy.applicationHref} pureChildren={true}>
              <Button size="small" as="div">
                {n('applyForJob', 'Sækja um starf')}
              </Button>
            </LinkV2>
          </Inline>
        )}
      </Stack>
    </SidebarLayout>
  )
}

IcelandicGovernmentInstitutionVacancyDetails.getInitialProps = async ({
  apolloClient,
  query,
  locale,
}) => {
  if (!query?.id || isNaN(Number(query?.id))) {
    throw new CustomNextError(404, 'Vacancy was not found')
  }

  const [vacancyResponse, namespaceResponse] = await Promise.all([
    apolloClient.query<
      GetIcelandicGovernmentInstitutionVacancyDetailsQuery,
      GetIcelandicGovernmentInstitutionVacancyDetailsQueryVariables
    >({
      query: GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCY_DETAILS,
      variables: {
        input: {
          id: Number(query.id),
        },
      },
    }),
    apolloClient.query<GetNamespaceQuery, GetNamespaceQueryVariables>({
      query: GET_NAMESPACE_QUERY,
      variables: {
        input: {
          lang: locale,
          namespace: 'Starfatorg',
        },
      },
    }),
  ])

  const vacancy =
    vacancyResponse?.data?.icelandicGovernmentInstitutionVacancyById?.vacancy

  if (!vacancy) {
    throw new CustomNextError(404, 'Vacancy was not found')
  }

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  return {
    vacancy,
    namespace,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacancyDetails)
