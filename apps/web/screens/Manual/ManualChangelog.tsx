import { Box, Divider, LinkV2, Stack, Text } from '@island.is/island-ui/core'
import { useLinkResolver, useNamespace } from '@island.is/web/hooks'
import useContentfulId from '@island.is/web/hooks/useContentfulId'
import useLocalLinkTypeResolver from '@island.is/web/hooks/useLocalLinkTypeResolver'
import { useI18n } from '@island.is/web/i18n'
import { withMainLayout } from '@island.is/web/layouts/main'

import { ManualWrapper } from './components/ManualWrapper'
import { getProps, ManualScreen } from './utils'
import * as styles from './Manual.css'

const ManualChapter: ManualScreen = ({ manual, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id)

  return (
    <ManualWrapper manual={manual} namespace={namespace}>
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
          <Stack space={2}>
            <Text variant="h2" as="h2">
              {n(
                'manualChangelogTitle',
                activeLocale === 'is' ? 'Breytingasaga' : 'Changelog',
              )}
            </Text>
            <Text>
              {n(
                'manualChangelogDescription',
                activeLocale === 'is'
                  ? 'Efnislegar breytingar sem orðið hafa á texta skjalsins og dagsetning þeirra. Ekki er getið smávægilegra breytinga á orðalagi, leiðréttinga eða breytinga á uppsetningu skjalsins.'
                  : 'Material changes that have occurred to the text of the document and their date. Minor changes in wording, corrections or changes to the layout of the document are not mentioned.',
              )}
            </Text>
          </Stack>
        </Box>
      </Stack>

      <Stack space={3}>
        {/* TODO: display accordions containing changelog */}
        {/* {manualChapter && (
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
            )} */}
      </Stack>
    </ManualWrapper>
  )
}

ManualChapter.getProps = getProps

export default withMainLayout(ManualChapter)
