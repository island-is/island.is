import React from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import {
  ContentLanguage,
  Organization,
  Query,
  QueryGetNamespaceArgs,
  QueryGetOrganizationArgs,
  QueryGetSupportQnAsArgs,
  QueryGetSupportQnAsInOrganizationArgs,
} from '@island.is/web/graphql/schema'
import {
  GET_NAMESPACE_QUERY,
  GET_ORGANIZATION_QUERY,
  GET_SUPPORT_QNAS,
  GET_SUPPORT_QNAS_IN_ORGANIZATION,
} from '../../queries'
import { Screen } from '../../../types'
import {
  Accordion,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'

import { questions } from '../mock'
import {
  Card,
  SimpleSlider,
  ServiceWebSearchSection,
  ServiceWebHeader,
} from '@island.is/web/components'
import { LinkResolverResponse } from '@island.is/web/hooks/useLinkResolver'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import ContactBanner from '../ContactBanner/ContactBanner'

import { asSlug } from '../utils'
import * as styles from './Home.treat'
import * as sharedStyles from '../shared/styles.treat'

interface HomeProps {
  organization?: Organization
  namespace: Query['getNamespace']
  supportQNAs: Query['getSupportQNAs'] | Query['getSupportQNAsInOrganization']
}

function generateCategories(
  supportQNAs: Query['getSupportQNAs'] | Query['getSupportQNAsInOrganization'],
) {
  const categorykeys = []
  const categories = []
  for (const supportQNA of supportQNAs) {
    const categorykey = `${supportQNA.category.title}.${supportQNA.category.slug}`
    if (!categorykeys.includes(categorykey)) {
      categorykeys.push(categorykey)
      categories.push({
        title: supportQNA.category.title,
        slug: supportQNA.category.slug,
        description: supportQNA.category.description,
        organizationSlug: supportQNA.organization.slug,
      })
    }
  }

  return categories
}

const Home: Screen<HomeProps> = ({ organization, supportQNAs }) => {
  // const linkResolver = useLinkResolver()
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  const logoTitle =
    organization?.shortTitle ?? organization?.title ?? 'Ísland.is'

  const logoUrl =
    organization?.logo?.url ??
    '//images.ctfassets.net/8k0h54kbe6bj/6XhCz5Ss17OVLxpXNVDxAO/d3d6716bdb9ecdc5041e6baf68b92ba6/coat_of_arms.svg'

  const searchTitle = 'Getum við aðstoðað?'
  const supportCategories = generateCategories(supportQNAs)

  return (
    <>
      <ServiceWebHeader hideSearch logoTitle={logoTitle} />
      <div className={sharedStyles.bg} />
      <Box className={styles.searchSection}>
        <ServiceWebSearchSection
          logoTitle={logoTitle}
          logoUrl={logoUrl}
          title={searchTitle}
        />
      </Box>
      {!isMobile ? (
        <Box className={styles.categories}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12" paddingBottom={[2, 2, 3]}>
                <Text variant="h3" color="white">
                  Svör eftir flokkum
                </Text>
              </GridColumn>
            </GridRow>
            <GridRow>
              {supportCategories.map(
                ({ title, slug, description, organizationSlug }, index) => {
                  return (
                    <GridColumn
                      key={index}
                      span={['12/12', '6/12', '6/12', '4/12']}
                      paddingBottom={[2, 2, 3]}
                    >
                      <Card
                        title={title}
                        description={description}
                        link={
                          {
                            href: `/thjonustuvefur/${organizationSlug}/${asSlug(
                              slug,
                            )}`,
                          } as LinkResolverResponse
                        }
                      />
                    </GridColumn>
                  )
                },
              )}
            </GridRow>
          </GridContainer>
        </Box>
      ) : (
        <Box className={styles.categories}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12">
                <SimpleSlider
                  title={'Svör eftir flokkum'}
                  titleColor={'white'}
                  breakpoints={{
                    0: {
                      gutterWidth: theme.grid.gutter.mobile,
                      slideCount: 1,
                      slideWidthOffset: 100,
                    },
                    [theme.breakpoints.sm]: {
                      gutterWidth: theme.grid.gutter.mobile,
                      slideCount: 1,
                      slideWidthOffset: 200,
                    },
                    [theme.breakpoints.md]: {
                      gutterWidth: theme.spacing[3],
                      slideCount: 1,
                      slideWidthOffset: 300,
                    },
                    [theme.breakpoints.xl]: {
                      gutterWidth: theme.spacing[3],
                      slideCount: 1,
                      slideWidthOffset: 400,
                    },
                  }}
                  items={supportCategories.map(
                    ({ title, slug, description, organizationSlug }, index) => {
                      return (
                        <Card
                          key={index}
                          title={title}
                          description={description}
                          link={
                            {
                              href: `/thjonustuvefur/${organizationSlug}/${asSlug(
                                slug,
                              )}`,
                            } as LinkResolverResponse
                          }
                        />
                      )
                    },
                  )}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
      <Box marginY={[7, 10, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <Box
                className={styles.faqs}
                paddingX={[2, 2, 4, 15]}
                paddingY={[2, 2, 4, 8]}
              >
                <Text variant="h3" as="h3">
                  Algengar spurningar
                </Text>

                <Box marginTop={[2, 2, 4, 5]}>
                  <Accordion
                    dividers={false}
                    dividerOnTop={false}
                    dividerOnBottom={false}
                  >
                    {questions.map(({ title }, index) => {
                      return (
                        <TopicCard key={index} href="/">
                          {title}
                        </TopicCard>
                      )
                    })}
                  </Accordion>
                </Box>
              </Box>
              <Box marginY={[10, 10, 20]}>
                <ContactBanner />
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string
  console.log('SLUG:', slug)

  const [organization, namespace, supportQNAs] = await Promise.all([
    !!slug &&
      apolloClient.query<Query, QueryGetOrganizationArgs>({
        query: GET_ORGANIZATION_QUERY,
        variables: {
          input: {
            slug,
            lang: locale as ContentLanguage,
          },
        },
      }),
    apolloClient
      .query<Query, QueryGetNamespaceArgs>({
        query: GET_NAMESPACE_QUERY,
        variables: {
          input: {
            namespace: 'Global',
            lang: locale,
          },
        },
      })
      .then((variables) =>
        variables.data.getNamespace.fields
          ? JSON.parse(variables.data.getNamespace.fields)
          : {},
      ),
    slug
      ? apolloClient.query<Query, QueryGetSupportQnAsInOrganizationArgs>({
          query: GET_SUPPORT_QNAS_IN_ORGANIZATION,
          variables: {
            input: {
              lang: locale,
              slug: slug,
            },
          },
        })
      : apolloClient.query<Query, QueryGetSupportQnAsArgs>({
          query: GET_SUPPORT_QNAS,
          variables: {
            input: {
              lang: locale,
            },
          },
        }),
  ])

  const supportData = slug
    ? supportQNAs?.data?.getSupportQNAsInOrganization
    : supportQNAs?.data?.getSupportQNAs

  return {
    organization: organization?.data?.getOrganization,
    namespace,
    supportQNAs: supportData,
  }
}

export default withMainLayout(Home, {
  showHeader: false,
})
