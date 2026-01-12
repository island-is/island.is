import { ReactNode } from 'react'
import { useWindowSize } from 'react-use'

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

import { Webreader } from '../../Webreader'
import * as styles from './Header.css'

type QuickLink = {
  title: string
  href: string
  variant?: TagVariant
}

export type HeaderProps = {
  title: string
  description?: string
  breadcrumbs: ReactNode
  quickLinks?: Array<QuickLink>
  shortcutsTitle?: string
  searchUrl?: string
  searchPlaceholder?: string
  offset?: boolean
}

export type ImageProps = HeaderProps & {
  featuredImage: string
  featuredImageAlt: string
}

export type NoImageProps = HeaderProps & {
  featuredImage: never
  featuredImageAlt: never
}

export type HeaderWithImageProps = ImageProps | NoImageProps

export const GrantsHeader = (props: HeaderWithImageProps) => {
  const renderSearchSection = () => {
    if (!props.searchUrl) {
      return
    }

    return (
      <Box marginTop={6} component="form" action={props.searchUrl}>
        <Input
          id="query"
          name="query"
          placeholder={props.searchPlaceholder}
          backgroundColor="blue"
          size="md"
          aria-label="Search input"
          icon={{
            name: 'search',
            type: 'outline',
          }}
          className={styles.searchBox}
        />
      </Box>
    )
  }

  const renderQuickLinks = () => {
    if (!props.quickLinks) {
      return
    }
    return (
      <Box marginTop={4}>
        {props.shortcutsTitle && (
          <Text variant="eyebrow" as="h3" paddingBottom={1} color="purple400">
            {props.shortcutsTitle}
          </Text>
        )}
        <Inline space={1}>
          {props.quickLinks.map((q) => (
            <Tag key={`${q.href}-${q.title}`} href={q.href} variant={q.variant}>
              {q.title}
            </Tag>
          ))}
        </Inline>
      </Box>
    )
  }

  const renderImage = () => {
    if (!props.featuredImage) {
      return
    }
    return (
      <Box
        display="flex"
        height="full"
        justifyContent="center"
        alignItems="center"
      >
        <img
          src={props.featuredImage}
          className={styles.image}
          alt={props.featuredImageAlt}
        />
      </Box>
    )
  }

  return (
    <Box>
      <GridContainer>
        <GridRow>
          <GridColumn
            paddingTop={[6, 6, 6, 8, 8]}
            offset={props.offset ? ['0', '0', '0', '1/12', '1/12'] : ['0']}
            span={
              props.offset
                ? ['1/1', '1/1', '4/6', '6/12', '6/12']
                : ['1/1', '1/1', '4/6', '7/12', '7/12']
            }
          >
            {props.breadcrumbs}
            <Text as="h1" variant="h1" marginY={2}>
              {props.title}
            </Text>
            <Webreader readId={undefined} readClass="rs_read" />
            {props.description && (
              <Text variant="intro">{props.description}</Text>
            )}
            {renderSearchSection()}
            {renderQuickLinks()}
          </GridColumn>
          <GridColumn
            span={['0', '0', '2/6', '4/12', '4/12']}
            offset={['0', '0', '0', '1/12', '1/12']}
            hiddenBelow="md"
          >
            {renderImage()}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
