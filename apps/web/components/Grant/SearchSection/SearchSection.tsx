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
import SearchInput from '../../SearchInput/SearchInput'
import { useI18n } from '@island.is/web/i18n'

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
  const { activeLocale } = useI18n()

  return (
    <HeaderWithImage {...props}>
      <Box
        marginTop={6}
        component="form"
        aria-label="Search grants"
        action={props.searchUrl}
      >
        <SearchInput
          id="query"
          placeholder={props.searchPlaceholder}
          size="large"
          aria-label="Search input"
          activeLocale={activeLocale}
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
