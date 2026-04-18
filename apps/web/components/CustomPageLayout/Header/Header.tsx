import { ReactNode } from 'react'

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
import { ShortcutCard } from './ShortcutCard'
import * as styles from './Header.css'

type ShortcutItem = {
  title: string
  href: string
  variant?: TagVariant
}

type ShortcutItemCard = ShortcutItem & {
  imgSrc: string
  imgAlt?: string
}

type Shortcuts = {
  title?: string
} & (
  | {
      variant: 'tags'
      items: Array<ShortcutItem>
    }
  | {
      variant: 'cards'
      items: Array<ShortcutItemCard>
    }
)

export type CustomPageLayoutHeaderProps = {
  title: string
  description?: string
  breadcrumbs: ReactNode
  featuredImage?: {
    src: string
    alt: string
  }
  shortcuts?: Shortcuts
  searchUrl?: string
  searchPlaceholder?: string
  offset?: boolean
}

export const CustomPageLayoutHeader = (props: CustomPageLayoutHeaderProps) => {
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

  const renderShortcuts = () => {
    if (!props.shortcuts) {
      return
    }

    const { title, variant, items } = props.shortcuts

    if (variant === 'cards') {
      return (
        <Box marginTop={4}>
          <GridRow>
            {items.map((shortcut) => (
              <GridColumn span={'1/2'}>
                <ShortcutCard {...shortcut} />
              </GridColumn>
            ))}
          </GridRow>
        </Box>
      )
    }

    return (
      <Box marginTop={4}>
        {title && (
          <Text variant="eyebrow" as="h3" paddingBottom={1} color="purple400">
            {title}
          </Text>
        )}
        <Inline space={1}>
          {items.map(({ href, title, variant }) => (
            <Tag key={`${href}-${title}`} href={href} variant={variant}>
              {title}
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
          src={props.featuredImage.src}
          className={styles.image}
          alt={props.featuredImage.alt}
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
            {renderShortcuts()}
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
