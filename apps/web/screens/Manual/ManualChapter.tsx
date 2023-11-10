import { useMemo } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Accordion,
  AccordionItem,
  Box,
  Divider,
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

const createChapterItemNavigation = (chapterItem: OneColumnText) => {
  const navigation = createNavigation(
    (chapterItem?.content ?? []) as unknown as AllSlicesFragment[],
    {
      htmlTags: [BLOCKS.HEADING_3],
    },
  )

  // we'll hide the chapter item navigation if it's only one item
  return navigation.length > 1 ? navigation : []
}

const ChapterItemTableOfContents = ({
  chapterItem,
  title,
}: {
  chapterItem: OneColumnText
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

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id, manualChapter?.id)

  const tableOfContentsTitle = n(
    'manualChapterItemTableOfContentsTitle',
    activeLocale === 'is' ? 'Efni kaflans' : 'Chapter content',
  ) as string

  return (
    <ManualWrapper
      manual={manual}
      namespace={namespace}
      socialTitle={generateOgTitle(manual?.title, manualChapter?.title)}
    >
      {manualChapter && (
        <Stack space={2}>
          <LinkV2
            className={styles.smallLink}
            underline="small"
            underlineVisibility="always"
            href={linkResolver('manual', [manual?.slug as string]).href}
          >
            {n(
              'manualFrontpage',
              activeLocale === 'is' ? 'Forsíða handbókar' : 'Manual frontpage',
            )}
          </LinkV2>
          <Divider />
          <Box paddingTop={2}>
            <Text variant="h2" as="h1">
              {manualChapter.title}
            </Text>
            {webRichText((manualChapter?.description ?? []) as SliceType[])}
          </Box>
        </Stack>
      )}

      <Stack space={3}>
        {manualChapter && (
          <Accordion>
            {manualChapter.chapterItems.map((item) => (
              <AccordionItem
                labelUse="h2"
                key={item.id}
                id={item.id}
                label={item.title}
              >
                <Box paddingTop={2}>
                  <ChapterItemTableOfContents
                    chapterItem={item as OneColumnText}
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
      </Stack>
    </ManualWrapper>
  )
}

ManualChapter.getProps = getProps

export default withMainLayout(ManualChapter)
