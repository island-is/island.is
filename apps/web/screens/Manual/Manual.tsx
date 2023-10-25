import { SliceType } from '@island.is/island-ui/contentful'
import { Box, Divider, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { webRichText } from '@island.is/web/utils/richText'

import { ManualWrapper } from './components/ManualWrapper'
import {
  extractTextFromManualChapterDescription,
  getProps,
  ManualScreen,
} from './utils'
import * as styles from './Manual.css'

const Manual: ManualScreen = ({ manual, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id)

  return (
    <ManualWrapper manual={manual} namespace={namespace}>
      {typeof manual?.description?.length === 'number' &&
        manual.description.length > 0 && (
          <Stack space={3}>
            <Divider />
            <Box>
              <Text variant="eyebrow">
                {n(
                  'manualPageAboutEyebrowText',
                  activeLocale === 'is' ? 'Um handbókina' : 'About manual',
                )}
              </Text>
              {webRichText((manual?.description ?? []) as SliceType[])}
            </Box>
          </Stack>
        )}

      <Stack space={3}>
        {manual?.chapters.map((chapter, index) => (
          <Stack space={3}>
            {index === 0 && <Divider />}
            <Stack space={1} key={chapter.id}>
              <LinkV2
                className={styles.link}
                underlineVisibility="always"
                underline="small"
                color="blue400"
                href={
                  linkResolver('manualchapter', [manual.slug, chapter.slug])
                    .href
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
      </Stack>
    </ManualWrapper>
  )
}

Manual.getProps = getProps

export default withMainLayout(Manual)
