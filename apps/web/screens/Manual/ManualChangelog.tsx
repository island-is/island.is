import { useMemo } from 'react'

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
import { useDateUtils } from '@island.is/web/i18n/useDateUtils'
import { withMainLayout } from '@island.is/web/layouts/main'
import { nlToBr } from '@island.is/web/utils/nlToBr'

import { ManualWrapper } from './components/ManualWrapper'
import {
  extractChangelogFromManual,
  generateOgTitle,
  getProps,
  ManualScreen,
} from './utils'
import * as styles from './Manual.css'

const ManualChangelog: ManualScreen = ({ manual, namespace }) => {
  const { linkResolver } = useLinkResolver()
  const n = useNamespace(namespace)
  const { activeLocale } = useI18n()

  useLocalLinkTypeResolver()
  useContentfulId(manual?.id)
  const { format } = useDateUtils()

  const changelog = useMemo(() => {
    return extractChangelogFromManual(manual)
  }, [manual])

  const manualChangelogTitle = n(
    'manualChangelogTitle',
    activeLocale === 'is' ? 'Breytingasaga' : 'Changelog',
  ) as string

  return (
    <ManualWrapper
      manual={manual}
      namespace={namespace}
      socialTitle={generateOgTitle(manual?.title, manualChangelogTitle)}
    >
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
            <Text variant="h2" as="h1">
              {manualChangelogTitle}
            </Text>
            <Text>
              {nlToBr(
                n(
                  'manualChangelogDescription',
                  activeLocale === 'is'
                    ? 'Efnislegar breytingar sem orðið hafa á texta skjalsins og dagsetning þeirra.\nEkki er getið smávægilegra breytinga á orðalagi, leiðréttinga eða breytinga á uppsetningu skjalsins.'
                    : 'Material changes that have occurred to the text of the document and their date.\nMinor changes in wording, corrections or changes to the layout of the document are not mentioned.',
                ),
              )}
            </Text>
          </Stack>
        </Box>
      </Stack>
      {!changelog?.length && (
        <Box paddingTop={5}>
          <Text>
            {n(
              'manualChangelogNotFound',
              activeLocale === 'is'
                ? 'Engin breyting hefur verið gerð'
                : 'No changes have been logged',
            )}
          </Text>
        </Box>
      )}
      {changelog?.length > 0 && (
        <Accordion>
          {changelog.map(({ year, dates }) => (
            <AccordionItem
              labelUse="h2"
              key={year}
              id={year.toString()}
              label={year.toString()}
            >
              <Box paddingBottom={3}>
                <Stack space={6}>
                  {dates.map(({ date, items }) => (
                    <Stack space={3} key={date}>
                      <Text variant="h4" fontWeight="regular">
                        {format(new Date(date), 'do MMMM yyyy')}
                      </Text>
                      <Stack space={6}>
                        {items.map((item, index) => (
                          <Stack key={index} space={2}>
                            <LinkV2
                              className={styles.link}
                              underlineVisibility="always"
                              underline="small"
                              color="blue400"
                              href={
                                linkResolver('manualchapter', [
                                  item.manualSlug,
                                  item.chapterSlug,
                                ]).href
                              }
                            >
                              {item.chapterTitle}
                            </LinkV2>

                            <Text>{item.textualDescription}</Text>
                          </Stack>
                        ))}
                      </Stack>
                    </Stack>
                  ))}
                </Stack>
              </Box>
            </AccordionItem>
          ))}
        </Accordion>
      )}
    </ManualWrapper>
  )
}

ManualChangelog.getProps = getProps

export default withMainLayout(ManualChangelog)
