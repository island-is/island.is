import {
  Box,
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

type QuickLink = {
  title: string
  href: string
  variant?: TagVariant
}

type SearchSectionProps = HeaderWithImageProps & {
  searchPlaceholder: string
  quickLinks: Array<QuickLink>
  searchUrl: string
  shortcutsTitle: string
}

export const SearchSection = (props: SearchSectionProps) => {
  return (
    <HeaderWithImage {...props}>
      <Box
        paddingTop={6}
        component="form"
        aria-label="Search grants"
        action={props.searchUrl}
      >
        <Input
          id="query"
          name="query"
          placeholder={props.searchPlaceholder}
          backgroundColor={['blue']}
          aria-label="Search input"
          size="md"
          icon={{ name: 'search', type: 'outline' }}
        />
      </Box>

      <Box paddingTop={4}>
        <Text variant="eyebrow" as="h3" paddingBottom={1} color="purple400">
          {props.shortcutsTitle}
        </Text>
        <Inline space={1}>
          {props.quickLinks.map((q) => (
            <Tag key={`${q.href}-${q.title}`} href={q.href} variant={q.variant}>
              {q.title}
            </Tag>
          ))}
        </Inline>
      </Box>
    </HeaderWithImage>
  )
}
