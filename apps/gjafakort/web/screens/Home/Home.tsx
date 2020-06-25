import React from 'react'
import HtmlParser from 'react-html-parser'

import {
  Accordion,
  AccordionItem,
  Box,
  Hidden,
  Stack,
  Typography,
  Breadcrumbs,
  Button,
} from '@island.is/island-ui/core'

import { useI18n } from '../../i18n'
import { GiftCTA } from './components'
import Link from 'next/link'
import { Layout } from '../../components'

function Home() {
  const {
    t: { routes, ...t },
  } = useI18n()

  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={4}>
            <Breadcrumbs>
              <Link href={routes.home}>
                <a>Ísland.is</a>
              </Link>
              <span>{t.home.name}</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]} marginTop={1}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                {t.home.title}
              </Typography>
              <Typography variant="intro">{t.home.intro}</Typography>
              {t.home.description.map((item, index) => (
                <Typography variant="p" links key={index}>
                  {HtmlParser(item)}
                </Typography>
              ))}
            </Stack>
          </Box>
          <Hidden above="md">
            <Box marginBottom={3}>
              <GiftCTA />
            </Box>
          </Hidden>
          <Box marginBottom={3}>
            <Typography variant="h2" as="h2">
              {t.home.FAQ.title}
            </Typography>
          </Box>
          <Accordion dividerOnTop={false}>
            {t.home.FAQ.items.map((accordionItem, index) => (
              <AccordionItem
                key={index}
                label={accordionItem.label}
                id={index.toString()}
              >
                <Stack space={1}>
                  {accordionItem.contents.map((content, index) => (
                    <Typography variant="p" links key={index}>
                      {HtmlParser(content)}
                    </Typography>
                  ))}
                </Stack>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      }
      right={
        <Hidden below="lg">
          <Stack space={3}>
            <GiftCTA />
            <Link href={routes.privacyPolicy}>
              <Button variant="text" icon="arrowRight">
                {t.user.privacyPolicyButton}
              </Button>
            </Link>
          </Stack>
        </Hidden>
      }
    />
  )
}

export default Home
