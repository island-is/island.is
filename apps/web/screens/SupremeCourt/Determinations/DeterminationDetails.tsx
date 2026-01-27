import { useIntl } from 'react-intl'
import cn from 'classnames'
import capitalize from 'lodash/capitalize'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import { Box, GridContainer, Stack, Text } from '@island.is/island-ui/core'
import { OrganizationWrapper } from '@island.is/web/components'
import {
  CustomPageUniqueIdentifier,
  OrganizationPage,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationPageArgs,
} from '@island.is/web/graphql/schema'
import {
  type GetSupremeCourtDeterminationByIdQuery,
  type GetSupremeCourtDeterminationByIdQueryVariables,
} from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { CustomNextError } from '@island.is/web/units/errors'
import { webRichText } from '@island.is/web/utils/richText'

import {
  CustomScreen,
  withCustomPageWrapper,
} from '../../CustomPage/CustomPageWrapper'
import { getSubpageNavList } from '../../Organization/SubPage'
import { GET_NAMESPACE_QUERY } from '../../queries/Namespace'
import { GET_ORGANIZATION_PAGE_QUERY } from '../../queries/Organization'
import { GET_SUPREME_COURT_DETERMINATION_BY_ID_QUERY } from '../../queries/SupremeCourtDeterminations'
import { m } from './translations.strings'
import * as styles from './DeterminationDetails.css'

interface HtmlViewProps {
  item: NonNullable<
    GetSupremeCourtDeterminationByIdQuery['webSupremeCourtDeterminationById']
  >['item']
}

const HtmlView = ({ item }: HtmlViewProps) => {
  const { formatMessage } = useIntl()
  const { format } = useDateUtils()
  const logoUrl = formatMessage(m.detailsPage.logoUrl)

  const [a, b] = item.title.split('gegn')

  return (
    <Box paddingBottom={5} className="rs_read">
      <GridContainer>
        <Box
          display="flex"
          flexDirection="column"
          flexWrap="nowrap"
          alignItems="center"
        >
          <Box paddingBottom={5}>
            <Stack space={2}>
              {logoUrl && (
                <Box textAlign="center">
                  <img src={logoUrl} alt="" />
                </Box>
              )}
              <Text variant="h2" as="h1" textAlign="center">
                {formatMessage(m.detailsPage.court)}
              </Text>
              <Stack space={1}>
                <Text variant="h3" as="h2" textAlign="center">
                  {formatMessage(m.detailsPage.caseNumberPrefix)}{' '}
                  {item.caseNumber}
                </Text>
                {item.date && (
                  <Text textAlign="center">
                    {capitalize(
                      format(new Date(item.date), 'eeee d. MMMM yyyy').replace(
                        'dagur',
                        'dagurinn',
                      ),
                    )}
                  </Text>
                )}
                {Boolean(a) && Boolean(b) && (
                  <Box display="flex" justifyContent="center" paddingY={3}>
                    <Box className={styles.verdictHtmlTitleContainer}>
                      <Text>{a.trim()}</Text>
                      <Text>gegn</Text>
                      <Text> {b.trim()}</Text>
                    </Box>
                  </Box>
                )}
              </Stack>
              {item.keywords.length > 0 && (
                <Box className={styles.textMaxWidth} paddingX={[0, 6, 8, 12]}>
                  <Text variant="h4" as="h3">
                    {formatMessage(m.detailsPage.keywords)}
                  </Text>
                  <Text>{item.keywords.join(', ')}</Text>
                </Box>
              )}
              {item.presentings && (
                <Box className={styles.textMaxWidth} paddingX={[0, 6, 8, 12]}>
                  <Text variant="h4" as="h3">
                    {formatMessage(m.detailsPage.presentings)}
                  </Text>
                  <Text>{item.presentings}</Text>
                </Box>
              )}
            </Stack>
          </Box>
          <Box className={cn('rs_read', styles.textMaxWidth, styles.richText)}>
            {webRichText([item.richText] as SliceType[])}
          </Box>
        </Box>
      </GridContainer>
    </Box>
  )
}

interface DeterminationDetailsProps {
  organizationPage: OrganizationPage
  namespace: Record<string, string>
  item: GetSupremeCourtDeterminationByIdQuery['webSupremeCourtDeterminationById']['item']
}

const DeterminationDetails: CustomScreen<DeterminationDetailsProps> = ({
  organizationPage,
  namespace,
  item,
}) => {
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const router = useRouter()
  return (
    <OrganizationWrapper
      pageTitle="Ákvarðanir"
      organizationPage={organizationPage}
      navigationData={{
        title: n('navigationTitle', 'Efnisyfirlit'),
        items: getSubpageNavList(organizationPage, router),
      }}
      breadcrumbItems={[
        {
          title: 'Ísland.is',
          href: linkResolver('homepage').href,
        },
        {
          title: organizationPage.title,
          href: linkResolver('organizationpage', [organizationPage.slug]).href,
        },
        {
          title: 'Ákvarðanir',
          href: '/s/haestirettur/akvardanir',
        },
      ]}
    >
      <Stack space={2}>
        <HtmlView item={item} />
      </Stack>
    </OrganizationWrapper>
  )
}

DeterminationDetails.getProps = async ({ apolloClient, query, locale }) => {
  const [{ data }, organizationPage, namespace] = await Promise.all([
    apolloClient.query<
      GetSupremeCourtDeterminationByIdQuery,
      GetSupremeCourtDeterminationByIdQueryVariables
    >({
      query: GET_SUPREME_COURT_DETERMINATION_BY_ID_QUERY,
      variables: {
        input: { id: query.id as string },
      },
    }),
    apolloClient.query<Query, QueryGetOrganizationPageArgs>({
      query: GET_ORGANIZATION_PAGE_QUERY,
      variables: {
        input: { slug: 'haestirettur', lang: locale },
      },
    }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: { namespace: 'OrganizationPages', lang: locale },
        },
      })
      .then((variables) =>
        variables.data.getNamespace?.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
  ])

  if (!organizationPage.data.getOrganizationPage) {
    throw new CustomNextError(404, 'Organization page not found')
  }

  if (!data?.webSupremeCourtDeterminationById?.item) {
    throw new CustomNextError(404, 'Determination not found')
  }

  return {
    item: data.webSupremeCourtDeterminationById.item,
    organizationPage: organizationPage.data.getOrganizationPage,
    namespace,
  }
}

export default withMainLayout(
  withCustomPageWrapper(
    CustomPageUniqueIdentifier.SupremeCourtDeterminations,
    DeterminationDetails,
  ),
  {
    footerVersion: 'organization',
  },
)
