import React from 'react'
import cn from 'classnames'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../../queries'
import { Screen } from '../../../types'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Stack,
  Text,
  TopicCard,
} from '@island.is/island-ui/core'

import { solution, questions } from '../mock'
import { ServiceWebHeader, renderHtml } from '@island.is/web/components'
import {
  LinkResolverResponse,
  useLinkResolver,
} from '@island.is/web/hooks/useLinkResolver'

import * as styles from './Category.treat'
import * as sharedStyles from '../shared/styles.treat'

interface CategoryProps {
  namespace: Query['getNamespace']
  slug: string
}

const Category: Screen<CategoryProps> = ({ slug }) => {
  const linkResolver = useLinkResolver()

  const logoTitle = 'Þjónustuvefur Sýslumanna'

  return (
    <>
      <ServiceWebHeader logoTitle={logoTitle} />
      <div className={cn(sharedStyles.bg, sharedStyles.bgSmall)} />
      <Box marginY={[3, 3, 10]}>
        <GridContainer>
          <GridRow>
            <GridColumn
              offset={[null, null, null, '1/12']}
              span={['12/12', '12/12', '12/12', '10/12']}
            >
              <GridContainer>
                <GridRow>
                  <GridColumn
                    span={['12/12', '12/12', '12/12', '9/12']}
                    paddingBottom={4}
                  >
                    <Text variant="h1" as="h1">
                      {solution.title}
                    </Text>
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn
                    span={['12/12', '12/12', '12/12', '9/12']}
                    paddingBottom={15}
                  >
                    {renderHtml(solution.description)}
                  </GridColumn>
                </GridRow>
                <GridRow>
                  <GridColumn span="12/12">
                    <Box
                      className={styles.faqs}
                      paddingX={[2, 2, 4, 15]}
                      paddingY={[2, 2, 4, 8]}
                    >
                      <GridContainer>
                        <GridRow>
                          <GridColumn
                            span={['12/12', '12/12', '12/12', '12/12', '9/12']}
                          >
                            <Stack space={1}>
                              <Text variant="h3" as="h3">
                                Skírteini
                              </Text>
                              <Text>
                                Vegabréf, ökuskírteini, bílpróf, ökuréttindi
                                o.fl.
                              </Text>
                            </Stack>

                            <Box marginTop={[2, 2, 4, 8]}>
                              <Stack space={2}>
                                {questions.map(({ q }, index) => {
                                  return (
                                    <TopicCard href="#" key={index}>
                                      {q}
                                    </TopicCard>
                                  )
                                })}
                              </Stack>
                            </Box>
                          </GridColumn>
                        </GridRow>
                      </GridContainer>
                    </Box>
                  </GridColumn>
                </GridRow>
              </GridContainer>
            </GridColumn>
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

Category.getInitialProps = async ({ apolloClient, locale, query }) => {
  const slug = query.slug as string

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
    slug,
  }
}

export default withMainLayout(Category, {
  showHeader: false,
})
