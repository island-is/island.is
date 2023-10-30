import { SliceType } from '@island.is/island-ui/contentful'
import {
  Accordion,
  AccordionItem,
  Box,
  Divider,
  LinkV2,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'
import { webRichText } from '@island.is/web/utils/richText'

import { ManualWrapper } from './components/ManualWrapper'
import { getProps, ManualScreen } from './utils'
import * as styles from './Manual.css'

const ManualChapter: ManualScreen = ({ manual, manualChapter, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id, manualChapter?.id)

  return (
    <ManualWrapper manual={manual} namespace={namespace}>
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
            <Text variant="h2" as="h2">
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
    </ManualWrapper>
  )
}

ManualChapter.getProps = getProps

export default withMainLayout(ManualChapter)
