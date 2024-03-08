import React, { ReactNode } from 'react'

import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Inline,
  Input,
  Tag,
  TagVariant,
  Text,
} from '@island.is/island-ui/core'
import { Query } from '@island.is/web/graphql/schema'

import * as s from './StjornartidindiHomeIntro.css'

export type StjornartidindiHomeIntroProps = {
  organizationPage?: Query['getOrganizationPage']
  organization?: Query['getOrganization']
  namespace: Record<string, string>
  breadCrumbs: ReactNode
  searchPlaceholder: string
  quickLinks: Array<{ title: string; href: string; variant?: TagVariant }>
  searchUrl: string
}

export const StjornartidindiHomeIntro = (
  props: StjornartidindiHomeIntroProps,
) => {
  const organizationPage = props.organizationPage

  if (!organizationPage) {
    return null
  }
  // const o = useNamespace(organizationNamespace)

  return (
    <GridContainer>
      <GridRow>
        <GridColumn
          offset={['0', '0', '0', '0', '1/12']}
          span={['1/1', '1/1', '1/1', '9/12', '7/12']}
          paddingTop={[0, 0, 0, 8]}
          paddingBottom={2}
        >
          {props.breadCrumbs}

          <Text as="h1" variant="h1" marginTop={2} marginBottom={2}>
            {organizationPage && organizationPage.title}
          </Text>

          {organizationPage?.description && (
            <Text variant="default">{organizationPage?.description}</Text>
          )}

          <Box paddingTop={6} component="form" action={props.searchUrl}>
            <Input
              id="q"
              name="q"
              placeholder={props.searchPlaceholder}
              backgroundColor={['blue']}
              size="md"
              icon={{ name: 'search', type: 'outline' }}
            />
          </Box>

          <Box paddingTop={4}>
            <Text variant="eyebrow" as="h3" paddingBottom={1} color="purple400">
              Flýtileiðir
            </Text>
            <Inline space={1}>
              {props.quickLinks.map((q, i) => (
                <Tag key={i} href={q.href} variant={q.variant}>
                  {q.title}
                </Tag>
              ))}
            </Inline>
          </Box>
        </GridColumn>

        {organizationPage.featuredImage && (
          <GridColumn span="3/12" hiddenBelow="lg" paddingTop={[0, 0, 0, 2]}>
            <img
              className={s.introImage}
              src={organizationPage.featuredImage.url}
              alt={organizationPage.featuredImage.title}
            />
          </GridColumn>
        )}
      </GridRow>
    </GridContainer>
  )
}
