import React from 'react'

import {
  Accordion,
  AccordionItem,
  Box,
  Hidden,
  Stack,
  Typography,
  Breadcrumbs,
} from '@island.is/island-ui/core'

import { useI18n } from '../../i18n'
import { GiftCTA } from './components'
import Link from 'next/link'
import { Layout } from '../../components'

function Home() {
  const { t } = useI18n()

  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={4}>
            <Breadcrumbs>
              <Link href="/">
                <a>{t('name')}</a>
              </Link>
              <span>{t('intro.name')}</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                {t('intro.title')}
              </Typography>
              <Typography variant="intro">{t('intro.intro')}</Typography>
              <Typography variant="p">{t('intro.description')}</Typography>
            </Stack>
          </Box>
          <Hidden above="md">
            <Box marginBottom={3}>
              <GiftCTA />
            </Box>
          </Hidden>
          <Box marginBottom={3}>
            <Typography variant="h2" as="h2">
              {t('intro.FAQ.title')}
            </Typography>
          </Box>
          <Accordion dividerOnTop={false}>
            {((t('intro.FAQ.items') as unknown) as Array<any>).map(
              (accordionItem, index) => (
                <AccordionItem
                  key={index}
                  label={accordionItem.label}
                  id={index.toString()}
                >
                  <Stack space={1}>
                    {accordionItem.contents.map((content) => (
                      <Typography variant="p">{content}</Typography>
                    ))}
                  </Stack>
                </AccordionItem>
              ),
            )}
          </Accordion>
        </Box>
      }
      right={
        <Hidden below="lg">
          <GiftCTA />
        </Hidden>
      }
    />
  )
}

export default Home
