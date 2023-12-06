import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  AsyncSearchInput,
  Box,
  Breadcrumbs,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { webRichText } from '@island.is/web/utils/richText'

import { extractLastUpdatedDateFromManual, ManualType } from '../utils'
import * as styles from './ManualHeader.css'

interface ManualHeaderProps {
  manual: ManualType
  namespace: Record<string, string>
}

export const ManualHeader = ({ manual, namespace }: ManualHeaderProps) => {
  const { activeLocale } = useI18n()
  const n = useNamespace(namespace)
  const { linkResolver } = useLinkResolver()
  const { format } = useDateUtils()
  const router = useRouter()

  const [searchValue, setSearchValue] = useState('')
  const [searchInputHasFocus, setSearchInputHasFocus] = useState(false)

  const handleSearch = () => {
    if (!searchValue) {
      return
    }
    router.push(
      `${
        linkResolver('search').href
      }?q=${searchValue}&type=webManualChapterItem&referencedBy=${manual?.id}`,
    )
  }

  const lastUpdatedDate = useMemo(() => {
    const date = extractLastUpdatedDateFromManual(manual)
    return date ? format(date, 'do MMMM yyyy') : ''
  }, [format, manual])

  return (
    <Stack space={3}>
      <Breadcrumbs
        items={[
          {
            title: 'Ísland.is',
            href: activeLocale === 'is' ? '/' : '/en',
          },
        ]}
      />

      <Text variant="h1" as="h1">
        {manual?.title}
      </Text>
      <Stack space={1}>
        {manual?.organization?.slug && manual?.organization?.slug && (
          <Inline space={1}>
            <Text>
              {n(
                'manualPageOrganizationPrefix',
                activeLocale === 'is' ? 'Þjónustuaðili' : 'Service provider',
              )}
              :
            </Text>
            <LinkV2
              className={styles.link}
              color="blue400"
              underlineVisibility="always"
              underline="small"
              href={
                linkResolver('organizationpage', [manual.organization.slug])
                  .href
              }
            >
              {manual.organization.title}
            </LinkV2>
          </Inline>
        )}
        {lastUpdatedDate && (
          <Inline space={1}>
            <Text>
              {n(
                'manualPageLastUpdated',
                activeLocale === 'is' ? 'Síðast uppfært' : 'Last updated',
              )}
              :
            </Text>
            <Text>{lastUpdatedDate} - </Text>
            <LinkV2
              className={styles.link}
              color="blue400"
              underlineVisibility="always"
              underline="small"
              href={
                linkResolver('manualchangelog', [manual?.slug as string]).href
              }
            >
              {n(
                'manualPageSeeChangelogText',
                activeLocale === 'is' ? 'sjá breytingasögu' : 'see changelog',
              )}
            </LinkV2>
          </Inline>
        )}
        {typeof manual?.info?.length === 'number' &&
          manual.info.length > 0 &&
          webRichText(manual.info as SliceType[], undefined, activeLocale)}
      </Stack>

      {namespace?.displayManualSearchInput && (
        <Box className={styles.inputContainer}>
          <AsyncSearchInput
            buttonProps={{
              onClick: () => handleSearch(),
              onFocus: () => setSearchInputHasFocus(true),
              onBlur: () => setSearchInputHasFocus(false),
            }}
            inputProps={{
              onFocus: () => setSearchInputHasFocus(true),
              onBlur: () => setSearchInputHasFocus(false),
              name: 'manual-page-search-input',
              inputSize: 'medium',
              placeholder: n(
                'manualPageSearchInputPlaceholder',
                activeLocale === 'is'
                  ? 'Leitaðu í handbókinni'
                  : 'Search the manual',
              ),
              colored: true,
              onChange: (ev) => setSearchValue(ev.target.value),
              value: searchValue,
              onKeyDown: (ev) => {
                if (ev.key === 'Enter') {
                  handleSearch()
                }
              },
            }}
            hasFocus={searchInputHasFocus}
          />
        </Box>
      )}
    </Stack>
  )
}
