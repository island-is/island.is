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

import {
  HeaderWithImage,
  HeaderWithImageProps,
} from '../HeaderWithImage/HeaderWithImage'

type SearchSectionProps = HeaderWithImageProps & {
  searchPlaceholder: string
  quickLinks: Array<{ title: string; href: string; variant?: TagVariant }>
  searchUrl: string
  shortcutsTitle: string
  featuredImage?: string
}

export const SearchSection = (props: SearchSectionProps) => {
  return (
    <HeaderWithImage {...props}>
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
          {props.shortcutsTitle}
        </Text>
        <Inline space={1}>
          {props.quickLinks.map((q, i) => (
            <Tag key={i} href={q.href} variant={q.variant}>
              {q.title}
            </Tag>
          ))}
        </Inline>
      </Box>
    </HeaderWithImage>
  )
}
