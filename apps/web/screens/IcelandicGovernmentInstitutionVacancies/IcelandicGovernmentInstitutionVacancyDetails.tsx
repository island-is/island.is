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
  Hidden,
} from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { CustomNextError } from '@island.is/web/units/errors'
import SidebarLayout from '../Layouts/SidebarLayout'
import { InstitutionPanel } from '@island.is/web/components'
import { useI18n } from '@island.is/web/i18n'
import { GET_NAMESPACE_QUERY } from '../queries'
import { webRichText } from '@island.is/web/utils/richText'
import { SliceType } from '@island.is/island-ui/contentful'

type Vacancy = IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']

interface InformationPanelProps {
  vacancy: Vacancy
  namespace: Record<string, string>
}

const InformationPanel = ({ vacancy, namespace }: InformationPanelProps) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  return (
    <Stack space={3}>
      <InstitutionPanel
        img={vacancy.logoUrl}
        institutionTitle={n('institutionCardTitle', 'Þjónustuaðili')}
        institution={vacancy.institutionName}
        locale={activeLocale}
        imgContainerDisplay={['block', 'block', 'none', 'block']}
      />
      <Box background="dark100" borderRadius="large" padding={[3, 3, 4]}>
        <Stack space={3}>
          <Text variant="h3">
            {n('informationAboutJob', 'Upplýsingar um starf')}
          </Text>
          <Box borderTopWidth="standard" borderColor="dark200" />
          <Box>
            <Text fontWeight="semiBold">{n('fieldOfWork', 'Starf')}</Text>
            <Text variant="small">{vacancy.title}</Text>
          </Box>
          {vacancy.locations && (
            <Box>
              <Text fontWeight="semiBold">
                {vacancy.locations.length === 1
                  ? n('location', 'Staðsetning')
                  : n('locations', 'Staðsetningar')}
              </Text>
              {vacancy.locations.map((location, index) => (
                <Text key={index} variant="small">
                  {location.title}
                </Text>
              ))}
            </Box>
          )}
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
  )
}

interface IcelandicGovernmentInstitutionVacancyDetailsProps {
  vacancy: Vacancy
  namespace: Record<string, string>
}

const IcelandicGovernmentInstitutionVacancyDetails: Screen<IcelandicGovernmentInstitutionVacancyDetailsProps> = ({
  vacancy,
  namespace,
}) => {
  const { linkResolver } = useLinkResolver()

  const n = useNamespace(namespace)
  console.log(vacancy)
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
          <InformationPanel namespace={namespace} vacancy={vacancy} />
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
          ]}
        />
        <Hidden above="sm">
          <LinkV2
            href={linkResolver('vacancies').href}
            underlineVisibility="always"
            underline="normal"
            color="blue400"
          >
            <Icon size="small" icon="arrowBack" />
            {n('goBack', 'Til baka')}
          </LinkV2>
        </Hidden>
        <Text variant="h1">{vacancy.title}</Text>
        <Text as="div">{webRichText([vacancy.intro] as SliceType[])}</Text>

        <Text variant="h3" as="h2">
          {n('assignmentsAndResponibility', 'Helstu verkefni og ábyrgð')}
        </Text>

        <Text as="div">
          {webRichText([vacancy.qualificationRequirements] as SliceType[])}
        </Text>

        {vacancy.tasksAndResponsibilities && (
          <Text variant="h3" as="h2">
            {n('qualificationRequirements', 'Hæfniskröfur')}
          </Text>
        )}

        {vacancy.tasksAndResponsibilities && (
          <Text as="div">
            {webRichText([vacancy.tasksAndResponsibilities] as SliceType[])}
          </Text>
        )}

        {(vacancy.salaryTerms ||
          vacancy.description ||
          vacancy.jobPercentage ||
          vacancy.applicationDeadlineTo) && (
          <Text variant="h3" as="h2">
            {n('moreInfoAboutTheJob', 'Frekari upplýsingar um starfið')}
          </Text>
        )}

        {vacancy.salaryTerms &&
          webRichText([vacancy.salaryTerms] as SliceType[])}

        {vacancy.description &&
          webRichText([vacancy.description] as SliceType[])}

        {vacancy.jobPercentage && (
          <Text>
            {n('jobPercentageIs', 'Starfshlutfall er')} {vacancy.jobPercentage}
          </Text>
        )}

        {vacancy.applicationDeadlineTo && (
          <Text>
            {n('applicationDeadlineIs', 'Umsóknarfrestur er til og með')}{' '}
            {vacancy.applicationDeadlineTo}
          </Text>
        )}

        {vacancy.contacts?.length && (
          <Text variant="h3" as="h2">
            {n('contacts', 'Nánari upplýsingar veitir')}
          </Text>
        )}

        {vacancy.contacts?.length && (
          <Stack space={2}>
            {vacancy.contacts.map((contact, index) => (
              <Box key={index}>
                <Text>
                  {contact.name && contact.email
                    ? `${contact.name}, `
                    : contact.name}
                  {contact.email && (
                    <LinkV2
                      underlineVisibility="always"
                      underline="normal"
                      color="blue400"
                      href={`mailto:${contact.email}`}
                    >
                      {contact.email}
                    </LinkV2>
                  )}
                </Text>
                {contact.phone && (
                  <Text>
                    {n('telephone', 'Sími:')} {contact.phone}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        )}

        {vacancy.applicationHref && (
          <Inline>
            <LinkV2 href={vacancy.applicationHref} pureChildren={true}>
              <Button size="small" as="div">
                {n('applyForJob', 'Sækja um starf')}
              </Button>
            </LinkV2>
          </Inline>
        )}

        <Hidden above="sm">
          <Box marginTop={2}>
            <InformationPanel namespace={namespace} vacancy={vacancy} />
          </Box>
        </Hidden>
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

  if (namespace['display404']) {
    throw new CustomNextError(404, 'Vacancies on Ísland.is are turned off')
  }

  return {
    vacancy,
    namespace,
  }
}

export default withMainLayout(IcelandicGovernmentInstitutionVacancyDetails)
