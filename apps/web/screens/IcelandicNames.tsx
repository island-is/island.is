import React, { FC } from 'react'
import { useRouter } from 'next/router'
import NextLink from 'next/link'
import slugify from '@sindresorhus/slugify'
import {
  Box,
  Text,
  Stack,
  Breadcrumbs,
  Link,
  Button,
  LinkContext,
  GridContainer,
  GridRow,
  GridColumn,
} from '@island.is/island-ui/core'
import {
  HeadWithSocialSharing,
  InstitutionPanel,
  Sticky,
  IcelandicNamesSearcher,
} from '@island.is/web/components'
import { withMainLayout } from '@island.is/web/layouts/main'
import { GET_NAMESPACE_QUERY, GET_ORGANIZATION_QUERY } from './queries'
import { Screen } from '@island.is/web/types'
import { useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import {
  QueryGetNamespaceArgs,
  GetNamespaceQuery,
  GetOrganizationQuery,
  GetOrganizationQueryVariables,
} from '@island.is/web/graphql/schema'
import { SidebarLayout } from './Layouts/SidebarLayout'
import { LinkType, useLinkResolver } from '../hooks/useLinkResolver'

const RelatedContent: FC = () => {
  return (
    <Box background="purple100" borderRadius="large" padding={[3, 3, 4]}>
      <Stack space={[1, 1, 2]}>
        <Text variant="eyebrow" as="h2">
          Nánar um mannanöfn
        </Text>
        <Link href="/nafngjof" underline="normal">
          <Text as="span">Nafngjöf og nafnareglur</Text>
        </Link>
        <Link
          href="https://www.stjornarradid.is/raduneyti/nefndir/nanar-um-nefnd/?itemid=e219adf8-4214-11e7-941a-005056bc530c"
          underline="normal"
        >
          <Text as="span">Mannanafnanefnd á vef Stjórnarráðsins</Text>
        </Link>
      </Stack>
    </Box>
  )
}

export interface IcelandicNamesProps {
  namespace: GetNamespaceQuery['getNamespace']
  institution: GetOrganizationQuery['getOrganization']
}

const IcelandicNames: Screen<IcelandicNamesProps> = ({
  namespace,
  institution,
}) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const Router = useRouter()
  const { linkResolver } = useLinkResolver()

  return (
    <>
      <HeadWithSocialSharing
        title={'Leit í mannanafnaskrá'}
        description={
          'Þú getur leitað eftir upphafsstaf, hluta úr nafni eða heilu nafni.'
        }
      />
      <SidebarLayout
        isSticky={false}
        fullWidthContent
        sidebarContent={
          <Sticky>
            <Stack space={3}>
              <Box printHidden>
                <Button
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  size="small"
                  type="button"
                  variant="text"
                  onClick={() => Router.back()}
                >
                  Til baka
                </Button>
              </Box>
              {!!institution && (
                <InstitutionPanel
                  img={institution.logo?.url}
                  institutionTitle={n('organization')}
                  institution={institution.title}
                  locale={activeLocale}
                  linkProps={{ href: institution.link }}
                  imgContainerDisplay={['block', 'block', 'none', 'block']}
                />
              )}
              <RelatedContent />
            </Stack>
          </Sticky>
        }
      >
        <GridContainer id="main-content">
          <GridRow>
            <GridColumn
              offset={['0', '0', '0', '0', '1/9']}
              span={['9/9', '9/9', '9/9', '9/9', '7/9']}
            >
              <Box paddingLeft={[0, 0, 6, 6, 0]}>
                <Box
                  paddingBottom={[2, 2, 4]}
                  display={['none', 'none', 'block']}
                  printHidden
                >
                  <Breadcrumbs
                    items={[
                      {
                        title: 'Ísland.is',
                        typename: 'homepage',
                        href: '/',
                      },
                      {
                        isTag: true,
                        title: 'Mannanafnaskrá',
                      },
                    ]}
                    renderLink={(link, { typename, slug }) => {
                      return (
                        <NextLink
                          {...linkResolver(typename as LinkType, slug)}
                          passHref
                        >
                          {link}
                        </NextLink>
                      )
                    }}
                  />
                </Box>
                <Box
                  paddingBottom={[2, 2, 4]}
                  display={['flex', 'flex', 'none']}
                  justifyContent="spaceBetween"
                  alignItems="center"
                  printHidden
                >
                  <Box flexGrow={1} marginRight={6} overflow={'hidden'}>
                    <LinkContext.Provider
                      value={{
                        linkRenderer: (href, children) => (
                          <Link href={href} pureChildren skipTab>
                            Til baka
                          </Link>
                        ),
                      }}
                    >
                      <Text truncate>
                        <a href={'/'}>
                          <Button
                            preTextIcon="arrowBack"
                            preTextIconType="filled"
                            size="small"
                            type="button"
                            variant="text"
                          >
                            Til baka
                          </Button>
                        </a>
                      </Text>
                    </LinkContext.Provider>
                  </Box>
                </Box>
                <Box marginBottom={3}>
                  <Box marginBottom={4}>
                    <Text variant="h1" as="h1">
                      <span id={slugify('mannanafnaskrá')}>
                        Leit í mannanafnaskrá
                      </span>
                    </Text>
                  </Box>
                  <Box marginBottom={1}>
                    <Text variant="intro">
                      Þú getur leitað eftir upphafsstaf, hluta úr nafni eða
                      heilu nafni.
                    </Text>
                  </Box>
                  <Text>
                    Í úrskurðarsafni er hægt að sjá rökstuðning
                    mannanafnanefndar fyrir höfnun eða samþykki nafns, allt frá
                    árinu 2000. Úrskurðir með höfnun eru rauðir, samþykki bláir.
                  </Text>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
          <GridRow>
            <GridColumn offset={['0', '0', '0', '0', '1/9']} span={'9/9'}>
              <Box paddingLeft={[0, 0, 6, 6, 0]}>
                <IcelandicNamesSearcher />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
        <Box display={['block', 'block', 'none']} printHidden>
          <RelatedContent />
        </Box>
      </SidebarLayout>
    </>
  )
}

IcelandicNames.getInitialProps = async ({ apolloClient, query, locale }) => {
  const [institution, namespace] = await Promise.all([
    apolloClient
      .query<GetOrganizationQuery, GetOrganizationQueryVariables>({
        query: GET_ORGANIZATION_QUERY,
        variables: {
          input: {
            slug: 'thjodskra-islands',
            lang: 'is',
          },
        },
      })
      .then((content) => {
        // map data here to reduce data processing in component
        return content.data.getOrganization
      }),
    apolloClient
      .query<GetNamespaceQuery, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Articles',
            lang: locale,
          },
        },
      })
      .then((content) => {
        // map data here to reduce data processing in component
        return JSON.parse(content.data.getNamespace.fields)
      }),
  ])

  return {
    institution,
    namespace,
  }
}

export default withMainLayout(IcelandicNames)
