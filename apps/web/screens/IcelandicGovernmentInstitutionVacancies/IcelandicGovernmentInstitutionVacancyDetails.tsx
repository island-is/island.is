import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  Breadcrumbs,
  Button,
  Hidden,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  InstitutionPanel,
  Webreader,
} from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  GetIcelandicGovernmentInstitutionVacancyDetailsQuery,
  GetIcelandicGovernmentInstitutionVacancyDetailsQueryVariables,
  GetNamespaceQuery,
  GetNamespaceQueryVariables,
  IcelandicGovernmentInstitutionVacancyByIdResponse,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Screen } from '@island.is/web/types'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'
import { shortenText } from '@island.is/web/utils/shortenText'

import { withCustomPageWrapper } from '../CustomPage/CustomPageWrapper'
import SidebarLayout from '../Layouts/SidebarLayout'
import { GET_NAMESPACE_QUERY } from '../queries'
import { GET_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCY_DETAILS } from '../queries/IcelandicGovernmentInstitutionVacancies'
import { VACANCY_INTRO_MAX_LENGTH } from './IcelandicGovernmentInstitutionVacanciesList'

type Vacancy = IcelandicGovernmentInstitutionVacancyByIdResponse['vacancy']

interface InformationPanelProps {
  vacancy: Vacancy
  namespace: Record<string, string>
}

const InformationPanel = ({ vacancy, namespace }: InformationPanelProps) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  return (
    <Box>
      <Stack space={3}>
        {vacancy?.institutionName && (
          <InstitutionPanel
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            img={vacancy.logoUrl}
            institutionTitle={n('institutionCardTitle', 'Þjónustuaðili')}
            institution={vacancy.institutionName}
            locale={activeLocale}
            imgContainerDisplay={['block', 'block', 'none', 'block']}
          />
        )}
        <Box background="dark100" borderRadius="large" padding={[3, 3, 4]}>
          <Stack space={3}>
            <Text variant="h3">
              {n('informationAboutJob', 'Upplýsingar um starf')}
            </Text>
            <Box borderTopWidth="standard" borderColor="dark200" />
            <Box>
              <Text fontWeight="semiBold">{n('fieldOfWork', 'Starf')}</Text>
              <Text variant="small">{vacancy?.title}</Text>
            </Box>
            {vacancy?.locations && vacancy.locations?.length > 0 && (
              <Box>
                <Text fontWeight="semiBold">
                  {vacancy.locations.length === 1
                    ? n('location', 'Staðsetning')
                    : n('locations', 'Staðsetningar')}
                </Text>
                {vacancy.locations.map((location, index) => (
                  <Box key={index}>
                    <Text variant="small">{location.title}</Text>
                    {location.department && (
                      <Text variant="small">{location.department}</Text>
                    )}
                    {location.address && (
                      <Text variant="small">{location.address}</Text>
                    )}
                  </Box>
                ))}
              </Box>
            )}
            {vacancy?.jobPercentage && (
              <Box>
                <Text fontWeight="semiBold">
                  {n('jobPercentage', 'Starfshlutfall')}
                </Text>
                <Text variant="small">{vacancy.jobPercentage}</Text>
              </Box>
            )}
            {vacancy?.applicationDeadlineFrom && (
              <Box>
                <Text fontWeight="semiBold">
                  {n('applicationDeadlineFrom', 'Starf skráð')}
                </Text>
                <Text variant="small">{vacancy.applicationDeadlineFrom}</Text>
              </Box>
            )}
            {vacancy?.applicationDeadlineTo && (
              <Box>
                <Text fontWeight="semiBold">
                  {n('applicationDeadlineTo', 'Umsóknarfrestur')}
                </Text>
                <Text variant="small">{vacancy.applicationDeadlineTo}</Text>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  )
}

interface IcelandicGovernmentInstitutionVacancyDetailsProps {
  vacancy: Vacancy
  namespace: Record<string, string>
}

const IcelandicGovernmentInstitutionVacancyDetails: Screen<
  IcelandicGovernmentInstitutionVacancyDetailsProps
> = ({ vacancy, namespace }) => {
  const { linkResolver } = useLinkResolver()

  const n = useNamespace(namespace)

  const ogTitlePostfix = n('ogTitlePrefixForDetailsPage', ' | Ísland.is')

  const getSocialImageUrl = (url: string | undefined | null) => {
    const isSvg = url ? url.trim().toLocaleLowerCase().endsWith('svg') : false

    return isSvg
      ? n(
          'ogImageUrl',
          'https://images.ctfassets.net/8k0h54kbe6bj/5LqU9yD9nzO5oOijpZF0K0/b595e1cf3e72bc97b2f9d869a53f5da9/LE_-_Jobs_-_S3.png',
        )
      : url
  }

  return (
    <Box>
      <HeadWithSocialSharing
        title={`${vacancy?.title ?? ''}${vacancy?.title ? ogTitlePostfix : ''}`}
        description={shortenText(
          vacancy?.plainTextIntro ?? '',
          VACANCY_INTRO_MAX_LENGTH,
        )}
        imageUrl={getSocialImageUrl(vacancy?.logoUrl) ?? ''}
      >
        <meta name="robots" content="noindex, nofollow" />
      </HeadWithSocialSharing>

      <SidebarLayout
        sidebarContent={
          <Stack space={3}>
            <LinkV2 {...linkResolver('vacancies')} skipTab>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                truncate
              >
                {n('goBack', 'Til baka')}
              </Button>
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
            <LinkV2 {...linkResolver('vacancies')} skipTab>
              <Button
                preTextIcon="arrowBack"
                preTextIconType="filled"
                size="small"
                type="button"
                variant="text"
                truncate
              >
                {n('goBack', 'Til baka')}
              </Button>
            </LinkV2>
          </Hidden>
          <Box>
            <Box className="rs_read">
              <Text variant="h1" as="h1">
                {vacancy?.title}
              </Text>
            </Box>
            <Webreader
              marginBottom={0}
              readId={undefined}
              readClass="rs_read"
            />
          </Box>
          {vacancy?.intro && (
            <Box className="rs_read">
              <Text as="div">
                {webRichText([vacancy.intro] as SliceType[])}
              </Text>
            </Box>
          )}

          {vacancy?.tasksAndResponsibilities && (
            <Box className="rs_read">
              <Text variant="h3" as="h2">
                {n('assignmentsAndResponsibility', 'Helstu verkefni og ábyrgð')}
              </Text>
            </Box>
          )}

          {vacancy?.tasksAndResponsibilities && (
            <Box className="rs_read">
              <Text as="div">
                {webRichText([vacancy.tasksAndResponsibilities] as SliceType[])}
              </Text>
            </Box>
          )}

          {vacancy?.qualificationRequirements && (
            <Box className="rs_read">
              <Text variant="h3" as="h2">
                {n('qualificationRequirements', 'Hæfniskröfur')}
              </Text>
            </Box>
          )}

          {vacancy?.qualificationRequirements && (
            <Box className="rs_read">
              <Text as="div">
                {webRichText([
                  vacancy.qualificationRequirements,
                ] as SliceType[])}
              </Text>
            </Box>
          )}

          {(vacancy?.salaryTerms ||
            vacancy?.description ||
            vacancy?.jobPercentage ||
            vacancy?.applicationDeadlineTo) && (
            <Box className="rs_read">
              <Text variant="h3" as="h2">
                {n('moreInfoAboutTheJob', 'Frekari upplýsingar um starfið')}
              </Text>
            </Box>
          )}

          {vacancy?.salaryTerms && (
            <Box className="rs_read">
              <Text as="div">
                {webRichText([vacancy.salaryTerms] as SliceType[])}
              </Text>
            </Box>
          )}

          {vacancy?.description && (
            <Box className="rs_read">
              <Text as="div">
                {webRichText([vacancy.description] as SliceType[])}
              </Text>
            </Box>
          )}

          {vacancy?.jobPercentage && (
            <Box className="rs_read">
              <Text>
                {n('jobPercentageIs', 'Starfshlutfall er')}{' '}
                {vacancy.jobPercentage}
              </Text>
            </Box>
          )}

          {vacancy?.applicationDeadlineTo && (
            <Box className="rs_read">
              <Text>
                {n('applicationDeadlineIs', 'Umsóknarfrestur er til og með')}{' '}
                {vacancy.applicationDeadlineTo}
              </Text>
            </Box>
          )}

          {vacancy?.contacts && vacancy.contacts.length > 0 && (
            <Box className="rs_read">
              <Text variant="h3" as="h2">
                {n('contacts', 'Nánari upplýsingar veitir')}
              </Text>
            </Box>
          )}

          {vacancy?.contacts && vacancy.contacts.length > 0 && (
            <Stack space={2}>
              {vacancy.contacts.map((contact, index) => (
                <Box className="rs_read" key={index}>
                  <Text>{contact.name ?? ''}</Text>
                  {contact.jobTitle && <Text>{contact.jobTitle}</Text>}
                  {contact.email && (
                    <Text>
                      {n('email', 'Tölvupóstur:')}{' '}
                      <LinkV2
                        underlineVisibility="always"
                        underline="normal"
                        color="blue400"
                        href={`mailto:${contact.email}`}
                      >
                        {contact.email}
                      </LinkV2>
                    </Text>
                  )}

                  {contact.phone && (
                    <Text>
                      {n('telephone', 'Sími:')} {contact.phone}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          )}

          {vacancy?.applicationHref && (
            <Inline>
              <Box className="rs_read" marginTop={3} marginBottom={[0, 0, 5]}>
                <LinkV2 href={vacancy.applicationHref} pureChildren={true}>
                  <Button size="small" as="div">
                    {n('applyForJob', 'Sækja um starf')}
                  </Button>
                </LinkV2>
              </Box>
            </Inline>
          )}

          <Hidden above="sm">
            <Box marginTop={2}>
              <InformationPanel namespace={namespace} vacancy={vacancy} />
            </Box>
          </Hidden>
        </Stack>
      </SidebarLayout>
    </Box>
  )
}

IcelandicGovernmentInstitutionVacancyDetails.getProps = async ({
  apolloClient,
  query,
  locale,
}) => {
  if (!query?.id) {
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
          id: query.id as string,
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

  // Debug: Log vacancy data to verify address/department fields
  console.log('📄 Starfatorg Detail - Full vacancy data:', {
    id: vacancy.id,
    title: vacancy.title,
    locations: vacancy.locations,
    fullVacancy: vacancy,
  })

  const namespace = JSON.parse(
    namespaceResponse?.data?.getNamespace?.fields || '{}',
  ) as Record<string, string>

  return {
    vacancy,
    namespace,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.Vacancies,
    IcelandicGovernmentInstitutionVacancyDetails,
  ),
)
