import { useMemo, useState } from 'react'
import { useRouter } from 'next/router'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Accordion,
  AccordionItem,
  AsyncSearchInput,
  Box,
  Divider,
  GridContainer,
  Inline,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { webRichText } from '@island.is/web/utils/richText'

import {
  extractLastUpdatedDateFromManual,
  extractTextFromManualChapterDescription,
  getProps,
  ManualScreen,
} from './utils'
import * as styles from './Manual.css'

// TODO: Make 'EN' button work

const Manual: ManualScreen = ({ manual, manualChapter, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()
  const [searchValue, setSearchValue] = useState('')
  const [searchInputHasFocus, setSearchInputHasFocus] = useState(false)
  const { format } = useDateUtils()
  const router = useRouter()

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id, manualChapter?.id)

  const handleSearch = () => {
    if (!searchValue) {
      return
    }
    // TODO: redirect user to search page with manual filter pre-selected
    router.push(linkResolver('search').href + '?q=' + searchValue)
  }

  // TODO: test this
  const lastUpdatedDate = useMemo(() => {
    const date = extractLastUpdatedDateFromManual(manual)
    return date ? format(date, 'dd.mm.yyyy') : ''
  }, [format, manual])

  // TODO: separate pages so we can easily import a single thing in /pages folder to determine
  // If we want to display a manual chapter, changelog or simply the frontpage (manual chapter and changelog are very similar)

  // TODO: query chapter description as well
  return (
    <GridContainer>
      <Box paddingBottom={6}>
        <Stack space={3}>
          <Stack space={3}>
            <Text variant="h1" as="h1">
              {manual?.title}
            </Text>
            <Stack space={1}>
              {manual?.organization?.slug && manual?.organization?.slug && (
                <Inline space={1}>
                  <Text>
                    {n('manualPageOrganizationPrefix', 'Þjónustuaðili')}:
                  </Text>
                  <LinkV2
                    className={styles.link}
                    color="blue400"
                    underlineVisibility="always"
                    underline="small"
                    href={
                      linkResolver('organizationpage', [
                        manual.organization.slug,
                      ]).href
                    }
                  >
                    {manual.organization.title}
                  </LinkV2>
                </Inline>
              )}
              {lastUpdatedDate && (
                <Inline space={1}>
                  <Text>{n('manualPageLastUpdated', 'Síðast uppfært')}:</Text>
                  <Text>{lastUpdatedDate} - </Text>
                  <LinkV2
                    className={styles.link}
                    href={
                      linkResolver('manualchangelog', [manual?.slug as string])
                        .href
                    }
                  >
                    {n('manualPageSeeChangelogText', 'sjá breytingasögu')}
                  </LinkV2>
                </Inline>
              )}
              {typeof manual?.info?.length === 'number' &&
                manual.info.length > 0 &&
                webRichText(
                  manual.info as SliceType[],
                  undefined,
                  activeLocale,
                )}
            </Stack>

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
                    'Leitaðu í handbókinni',
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
          </Stack>

          {!manualChapter &&
            typeof manual?.description?.length === 'number' &&
            manual.description.length > 0 && (
              <Stack space={3}>
                <Divider />
                <Box>
                  <Text variant="eyebrow">
                    {n('manualPageAboutEyebrowText', 'Um handbókina')}
                  </Text>
                  {webRichText((manual?.description ?? []) as SliceType[])}
                </Box>
              </Stack>
            )}

          {manualChapter && (
            <Stack space={2}>
              <LinkV2
                className={styles.smallLink}
                underline="small"
                underlineVisibility="always"
                href={linkResolver('manual', [manual?.slug as string]).href}
              >
                {n('manualFrontpage', 'Forsíða handbókar')}
              </LinkV2>
              <Divider />
              <Box paddingTop={2}>
                <Text variant="h2" as="h2">
                  {manualChapter.title}
                </Text>
                {webRichText((manualChapter?.description ?? []) as SliceType[])}
              </Box>
            </Stack>
          )}

          <Stack space={3}>
            {!manualChapter &&
              manual?.chapters.map((chapter, index) => (
                <Stack space={3}>
                  {index === 0 && <Divider />}
                  <Stack space={1} key={chapter.id}>
                    <LinkV2
                      className={styles.link}
                      underlineVisibility="always"
                      underline="small"
                      color="blue400"
                      href={
                        linkResolver('manualchapter', [
                          manual.slug,
                          chapter.slug,
                        ]).href
                      }
                    >
                      {chapter.title}
                    </LinkV2>
                    <Text variant="medium" fontWeight="light">
                      {extractTextFromManualChapterDescription(chapter)}
                    </Text>
                  </Stack>
                  <Divider />
                </Stack>
              ))}
            {manualChapter && (
              <Accordion>
                {manualChapter.chapterItems.map((item) => (
                  <AccordionItem key={item.id} id={item.id} label={item.title}>
                    {webRichText(
                      item.content as SliceType[],
                      undefined,
                      activeLocale,
                    )}
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </Stack>
        </Stack>
      </Box>
    </GridContainer>
  )
}

Manual.getProps = getProps

export default withMainLayout(Manual)
