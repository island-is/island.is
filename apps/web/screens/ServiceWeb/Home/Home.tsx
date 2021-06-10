import React from 'react'
import slugify from '@sindresorhus/slugify'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../../queries'
import { Screen } from '../../../types'
import {
  Accordion,
  AccordionItem,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

import { categories, questions } from '../mock'
import {
  Card,
  SimpleSlider,
  ServiceWebSearchSection,
  ServiceWebHeader,
} from '@island.is/web/components'
import {
  LinkResolverResponse,
  useLinkResolver,
} from '@island.is/web/hooks/useLinkResolver'
import { theme } from '@island.is/island-ui/theme'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import * as styles from './Home.treat'
import * as sharedStyles from '../shared/styles.treat'

interface HomeProps {
  namespace: Query['getNamespace']
}

const Home: Screen<HomeProps> = ({}) => {
  const linkResolver = useLinkResolver()
  const { width } = useWindowSize()

  const isMobile = width < theme.breakpoints.md

  const logoTitle = 'Þjónustuvefur Sýslumanna'

  return (
    <>
      <ServiceWebHeader hideSearch logoTitle={logoTitle} />
      <div className={sharedStyles.bg} />
      <Box className={styles.searchSection}>
        <ServiceWebSearchSection
          logoTitle={logoTitle}
          title="Getum við aðstoðað?"
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
              {categories.map(({ title, description }, index) => {
                return (
                  <GridColumn
                    key={index}
                    span={['12/12', '6/12', '6/12', '4/12']}
                    paddingBottom={[2, 2, 3]}
                  >
                    <Card
                      link={
                        {
                          href: `/thjonustuvefur/${slugify(title)}`,
                        } as LinkResolverResponse
                      }
                      title={title}
                      description={description}
                    />
                  </GridColumn>
                )
              })}
            </GridRow>
          </GridContainer>
        </Box>
      ) : (
        <Box className={styles.categories}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12" paddingBottom={3}>
                <Text variant="h3" color="white">
                  Svör eftir flokkum
                </Text>
              </GridColumn>
            </GridRow>
            <GridRow>
              <GridColumn span="12/12">
                <SimpleSlider
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
                  items={categories.map(({ title, description }, index) => {
                    return (
                      <Card
                        key={index}
                        title={title}
                        description={description}
                        link={
                          {
                            href: `/thjonustuvefur/${slugify(title)}`,
                          } as LinkResolverResponse
                        }
                      />
                    )
                  })}
                />
              </GridColumn>
            </GridRow>
          </GridContainer>
        </Box>
      )}
      <Box marginY={[0, 0, 10]}>
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

                <Box marginTop={[2, 2, 4, 8]}>
                  <Accordion dividerOnTop={false} dividerOnBottom={false}>
                    {questions.map(({ q, a }, index) => {
                      return (
                        <AccordionItem
                          key={index}
                          id={`service-web-faq-${index}`}
                          label={q}
                        >
                          {a}
                        </AccordionItem>
                      )
                    })}
                  </Accordion>
                </Box>
              </Box>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

Home.getInitialProps = async ({ apolloClient, locale, query }) => {
  const [namespace] = await Promise.all([
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
  ])

  return {
    namespace,
  }
}

export default withMainLayout(Home, {
  showHeader: false,
})
