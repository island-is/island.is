/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import { withMainLayout } from '@island.is/web/layouts/main'
import { Query, QueryGetNamespaceArgs } from '@island.is/web/graphql/schema'
import { GET_NAMESPACE_QUERY } from '../queries'
import { Screen } from '../../types'
import { CustomNextError } from '@island.is/web/units/errors'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'

import { categories } from './mock'
import { Card, Section } from '@island.is/web/components'
import {
  LinkResolverResponse,
  useLinkResolver,
} from '@island.is/web/hooks/useLinkResolver'

import * as styles from './ServiceWeb.treat'

interface ServiceWebProps {
  namespace: Query['getNamespace']
}

const ServiceWeb: Screen<ServiceWebProps> = ({}) => {
  const linkResolver = useLinkResolver()

  return (
    <>
      <Box className={styles.header}>hey</Box>
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
                    link={{ href: `https://visir.is` } as LinkResolverResponse}
                    title={title}
                    description={description}
                  />
                </GridColumn>
              )
            })}
          </GridRow>
        </GridContainer>
      </Box>
    </>
  )
}

ServiceWeb.getInitialProps = async ({ apolloClient, locale, query }) => {
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

export default withMainLayout(ServiceWeb, {
  showHeader: false,
})
