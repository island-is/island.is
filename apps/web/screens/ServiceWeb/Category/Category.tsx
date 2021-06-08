/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
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
  TopicCard,
} from '@island.is/island-ui/core'

import { questions } from '../mock'
import {
  ServiceWebSearchSection,
  ServiceWebHeader,
} from '@island.is/web/components'
import {
  LinkResolverResponse,
  useLinkResolver,
} from '@island.is/web/hooks/useLinkResolver'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './Category.treat'

interface CategoryProps {
  namespace: Query['getNamespace']
}

const Category: Screen<CategoryProps> = ({}) => {
  const linkResolver = useLinkResolver()

  const logoTitle = 'Þjónustuvefur Sýslumanna'

  return (
    <>
      <ServiceWebHeader logoTitle={logoTitle} />
      <div className={styles.bg} />
      <Box className={styles.searchSection}>
        <ServiceWebSearchSection
          logoTitle={logoTitle}
          title="Getum við aðstoðað?"
        />
      </Box>
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
                    {questions.map(({ q }, index) => {
                      return (
                        <TopicCard href="https://visir.is" key={index}>
                          {q}
                        </TopicCard>
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

Category.getInitialProps = async ({ apolloClient, locale, query }) => {
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

export default withMainLayout(Category, {
  showHeader: false,
})
