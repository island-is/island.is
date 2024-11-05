import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryState } from 'next-usequerystate'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Accordion,
  AccordionItem,
  Box,
  Button,
  Divider,
  Inline,
  LinkV2,
  Stack,
  TableOfContents,
  Text,
} from '@island.is/island-ui/core'
import { AllSlicesFragment, OneColumnText } from '@island.is/web/graphql/schema'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { createNavigation } from '@island.is/web/utils/navigation'
import { webRichText } from '@island.is/web/utils/richText'

import { scrollTo } from '../../hooks/useScrollSpy'
import { ManualWrapper } from './components/ManualWrapper'
import { generateOgTitle, getProps, ManualScreen } from './utils'
import * as styles from './Manual.css'

type ChapterItem = OneColumnText & {
  typename: 'OneColumnText'
  content: AllSlicesFragment[]
}

const createChapterItemNavigation = (chapterItem: ChapterItem) => {
  const navigation = createNavigation(chapterItem?.content ?? [], {
    htmlTags: [BLOCKS.HEADING_3],
  })

  // we'll hide the chapter item navigation if it's only one item
  return navigation.length > 1 ? navigation : []
}

const ChapterItemTableOfContents = ({
  chapterItem,
  title,
}: {
  chapterItem: ChapterItem
  title: string
}) => {
  const navigation = useMemo(
    () => createChapterItemNavigation(chapterItem),
    [chapterItem],
  )

  if (navigation.length === 0) return null

  return (
    <TableOfContents
      tableOfContentsTitle={title}
      headings={navigation.map(({ id, text }) => ({
        headingTitle: text,
        headingId: id,
      }))}
      onClick={(id) => scrollTo(id, { smooth: true })}
    />
  )
}

const ManualChapter: ManualScreen = ({ manual, manualChapter, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  const [selectedItemId, setSelectedItemId] = useQueryState('selectedItemId')
  const [expandedItemIds, setExpandedItemIds] = useState(
    selectedItemId ? [selectedItemId] : [],
  )
  const initialScrollHasHappened = useRef(false)

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id, manualChapter?.id)

  const tableOfContentsTitle = n(
    'manualChapterItemTableOfContentsTitle',
    activeLocale === 'is' ? 'Efni kaflans' : 'Chapter content',
  ) as string

  useEffect(() => {
    if (!selectedItemId || initialScrollHasHappened.current) {
      return
    }
    scrollTo(selectedItemId, { smooth: true, marginTop: 64 })
    initialScrollHasHappened.current = true
  }, [selectedItemId])

  const { previousChapterUrl, nextChapterUrl } = useMemo(() => {
    if (!manual?.slug || !manualChapter?.id) {
      return {
        previousChapterUrl: '',
        nextChapterUrl: '',
      }
    }

    const index = manual.chapters.findIndex(
      (chapter) => chapter.id === manualChapter?.id,
    )

    if (index < 0) {
      return {
        previousChapterUrl: '',
        nextChapterUrl: '',
      }
    }

    const nextChapterSlug = manual.chapters[index + 1]?.slug

    if (index === 0) {
      return {
        previousChapterUrl: '',
        nextChapterUrl: nextChapterSlug
          ? linkResolver('manualchapter', [manual.slug, nextChapterSlug]).href
          : '',
      }
    }

    const previousChapterSlug = manual.chapters[index - 1]?.slug

    return {
      previousChapterUrl: previousChapterSlug
        ? linkResolver('manualchapter', [manual.slug, previousChapterSlug]).href
        : '',
      nextChapterUrl: nextChapterSlug
        ? linkResolver('manualchapter', [manual.slug, nextChapterSlug]).href
        : '',
    }
  }, [linkResolver, manual?.chapters, manual?.slug, manualChapter?.id])

  return (
    <ManualWrapper
      manual={manual}
      namespace={namespace}
      socialTitle={generateOgTitle(manual?.title, manualChapter?.title)}
    >
      {manualChapter && (
        <Stack space={5}>
          <LinkV2
            underline="small"
            underlineVisibility="always"
            color="blue400"
            href={linkResolver('manual', [manual?.slug as string]).href}
            className={styles.link}
          >
            {n(
              'manualFrontpage',
              activeLocale === 'is' ? 'Forsíða handbókar' : 'Manual frontpage',
            )}
          </LinkV2>
          <Divider />
          <Box>
            <Text variant="h2" as="h1">
              {manualChapter.title}
            </Text>
            {webRichText((manualChapter?.description ?? []) as SliceType[])}
          </Box>
        </Stack>
      )}

      <Stack space={3}>
        {manualChapter && (
          <Accordion singleExpand={false}>
            {manualChapter.chapterItems.map((item) => (
              <AccordionItem
                labelUse="h2"
                key={item.id}
                id={item.id}
                label={item.title}
                expanded={
                  expandedItemIds.includes(item.id) ||
                  item.id === selectedItemId
                }
                onToggle={(expanded) => {
                  initialScrollHasHappened.current = true
                  if (expanded) {
                    setExpandedItemIds((prev) => prev.concat(item.id))
                    setSelectedItemId(item.id)
                  } else {
                    setExpandedItemIds((prev) => {
                      const updatedExpandedItemIds = prev.filter(
                        (id) => id !== item.id,
                      )
                      if (selectedItemId === item.id) {
                        setSelectedItemId(
                          updatedExpandedItemIds[
                            updatedExpandedItemIds.length - 1
                          ] ?? null,
                        )
                      }
                      return updatedExpandedItemIds
                    })
                  }
                }}
              >
                <Box paddingTop={2}>
                  <ChapterItemTableOfContents
                    chapterItem={item as ChapterItem}
                    title={tableOfContentsTitle}
                  />
                </Box>
                {webRichText(
                  item.content as SliceType[],
                  undefined,
                  activeLocale,
                )}
              </AccordionItem>
            ))}
          </Accordion>
        )}
        {(Boolean(previousChapterUrl) || Boolean(nextChapterUrl)) && (
          <Box paddingTop={3}>
            <Inline space={3} alignY="center" justifyContent="spaceBetween">
              <Box>
                {previousChapterUrl && (
                  <LinkV2 href={previousChapterUrl}>
                    <Button
                      preTextIcon="arrowBack"
                      preTextIconType="filled"
                      size="medium"
                      type="button"
                      variant="text"
                      truncate
                      unfocusable
                    >
                      {n(
                        'manualPreviousChapter',
                        activeLocale === 'is'
                          ? 'Fyrri kafli'
                          : 'Previous chapter',
                      )}
                    </Button>
                  </LinkV2>
                )}
              </Box>
              <Box>
                {nextChapterUrl && (
                  <LinkV2 href={nextChapterUrl}>
                    <Button
                      icon="arrowForward"
                      iconType="filled"
                      size="medium"
                      type="button"
                      variant="text"
                      truncate
                      unfocusable
                    >
                      {n(
                        'manualNextChapter',
                        activeLocale === 'is' ? 'Næsti kafli' : 'Next chapter',
                      )}
                    </Button>
                  </LinkV2>
                )}
              </Box>
            </Inline>
          </Box>
        )}
      </Stack>
    </ManualWrapper>
  )
}

ManualChapter.getProps = getProps

export default withMainLayout(ManualChapter)
