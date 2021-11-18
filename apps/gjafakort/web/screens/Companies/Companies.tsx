import React from 'react'
import HtmlParser from 'react-html-parser'
import Link from 'next/link'

import {
  Accordion,
  AccordionItem,
  Box,
  Hidden,
  Stack,
  Typography,
  BreadcrumbsDeprecated as Breadcrumbs,
  BulletList,
  Bullet,
  VideoIframe,
} from '@island.is/island-ui/core'

import { useI18n } from '../../i18n'
import { CompanyCTA } from './components'
import { Layout } from '../../components'

function Companies() {
  const {
    t: { companies: t, routes },
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
              <span>{t.name}</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                {t.title}
              </Typography>
              <Typography variant="intro">{t.intro}</Typography>
              <Typography variant="p">{HtmlParser(t.description)}</Typography>
            </Stack>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]}>
            <Stack space={2}>
              <Typography variant="h4" as="h2">
                {t.notes.label}
              </Typography>
              <BulletList>
                {t.notes.items.map((item, index) => (
                  <Bullet key={`companies.notes.items-${index}`}>{item}</Bullet>
                ))}
              </BulletList>
              <Typography variant="p">
                {HtmlParser(t.notes.disclaimer)}
              </Typography>
            </Stack>
          </Box>
          <Hidden above="md">
            <Box marginBottom={3}>
              <CompanyCTA />
            </Box>
          </Hidden>
          <Box marginBottom={3}>
            <Typography variant="h2" as="h2">
              {t.FAQ.title}
            </Typography>
          </Box>
          <Accordion dividerOnTop={false}>
            {t.FAQ.items.map((accordionItem, index) => (
              <AccordionItem
                key={index}
                label={accordionItem.label}
                id={index.toString()}
              >
                <Stack space={3}>
                  {accordionItem.contents.map((content, index) =>
                    Array.isArray(content) ? (
                      <BulletList type="ol" key={index}>
                        {content.map((item) => (
                          <Bullet key={item}>{HtmlParser(item)}</Bullet>
                        ))}
                      </BulletList>
                    ) : (
                      <Typography variant="p" links key={index}>
                        {HtmlParser(content)}
                      </Typography>
                    ),
                  )}
                </Stack>
              </AccordionItem>
            ))}
            {t.FAQ.videos.map((accordionVideo, index) => (
              <AccordionItem
                key={accordionVideo.id}
                label={accordionVideo.label}
                id={index.toString()}
              >
                <VideoIframe
                  src={accordionVideo.url}
                  title={accordionVideo.label}
                />
              </AccordionItem>
            ))}
          </Accordion>
        </Box>
      }
      right={
        <Hidden below="lg">
          <CompanyCTA />
        </Hidden>
      }
    />
  )
}

export default Companies
