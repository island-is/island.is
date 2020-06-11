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
  Breadcrumbs,
  BulletList,
  Bullet,
} from '@island.is/island-ui/core'

import { useI18n } from '../../i18n'
import { CompanyCTA } from './components'
import { Layout } from '../../components'

function Companies() {
  const { t } = useI18n()

  return (
    <Layout
      left={
        <Box>
          <Box marginBottom={4}>
            <Breadcrumbs>
              <Link href="/">
                <a>{t.name}</a>
              </Link>
              <span>{t.companies.name}</span>
            </Breadcrumbs>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]}>
            <Stack space={3}>
              <Typography variant="h1" as="h1">
                {t.companies.title}
              </Typography>
              <Typography variant="intro">{t.companies.intro}</Typography>
              <Typography variant="p">{t.companies.description}</Typography>
            </Stack>
          </Box>
          <Box marginBottom={[3, 3, 3, 12]}>
            <Stack space={2}>
              <Typography variant="h4" as="h2">
                {t.companies.notes.label}
              </Typography>
              <BulletList>
                {t.companies.notes.items.map((item, index) => (
                  <Bullet key={`companies.notes.items-${index}`}>{item}</Bullet>
                ))}
              </BulletList>
            </Stack>
          </Box>
          <Hidden above="md">
            <Box marginBottom={3}>
              <CompanyCTA />
            </Box>
          </Hidden>
          <Box marginBottom={3}>
            <Typography variant="h2" as="h2">
              {t.companies.FAQ.title}
            </Typography>
          </Box>
          <Accordion dividerOnTop={false}>
            {t.companies.FAQ.items.map((accordionItem, index) => (
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
                          <Bullet key={item}>{item}</Bullet>
                        ))}
                      </BulletList>
                    ) : (
                      <Typography variant="p" key={index}>
                        {HtmlParser(content)}
                      </Typography>
                    ),
                  )}
                </Stack>
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
