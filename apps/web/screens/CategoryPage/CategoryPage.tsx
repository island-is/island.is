/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Card, Sidebar } from '../../components'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  AccordionCard,
  Select,
  LinkCard,
} from '@island.is/island-ui/core'

import { categories, groups, selectOptions, articles } from '../../json'

import * as styles from './CategoryPage.treat'

const CategoryPage = () => {
  const router = useRouter()

  const TITLE = 'Fjölskylda og velferð'
  const DESCRIPTION =
    'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.'

  const onChangeCategory = () => {
    router.push('/article')
  }

  return (
    <ContentBlock>
      <Box padding={[0, 0, 0, 6]}>
        <div className={styles.layout}>
          <div className={styles.side}>
            <Sidebar title="Flokkar">
              {categories.map((c, index) => (
                <Link key={index} href="#">
                  <a>
                    <Typography variant="p" as="span">
                      {c.title}
                    </Typography>
                  </a>
                </Link>
              ))}
            </Sidebar>
          </div>

          <Box paddingLeft={[0, 0, 0, 4]} width="full">
            <Box padding={[3, 3, 6, 0]}>
              <ContentBlock width="small">
                <Stack space={[3, 3, 4]}>
                  <Breadcrumbs>
                    <Link href="/">
                      <a>Ísland.is</a>
                    </Link>
                  </Breadcrumbs>
                  <Hidden above="md">
                    <Select
                      label="Þjónustuflokkar"
                      placeholder="Flokkar"
                      options={selectOptions}
                      onChange={onChangeCategory}
                      name="search"
                    />
                  </Hidden>
                  <Typography variant="h1" as="h1">
                    {TITLE}
                  </Typography>
                  <Typography variant="intro" as="p">
                    {DESCRIPTION}
                  </Typography>
                </Stack>
              </ContentBlock>
            </Box>
            <div className={styles.bg}>
              <Box padding={[3, 3, 6, 0]} paddingTop={[3, 3, 6, 6]}>
                <ContentBlock width="small">
                  <Stack space={2}>
                    <Stack space={2}>
                      {groups.map((group, index) => {
                        return (
                          <AccordionCard
                            key={index}
                            id={`accordion-${index}`}
                            label={group.title}
                            visibleContent={
                              <Box paddingY={2} paddingBottom={1}>
                                {group.description}
                              </Box>
                            }
                          >
                            <Stack space={2}>
                              {articles.map(({ title }, index) => {
                                return (
                                  <Link key={index} href="/article">
                                    <LinkCard key={index}>{title}</LinkCard>
                                  </Link>
                                )
                              })}
                            </Stack>
                          </AccordionCard>
                        )
                      })}
                    </Stack>
                    <Stack space={2}>
                      {groups.map((group, index) => {
                        return (
                          <Card
                            key={index}
                            {...group}
                            href="/article"
                            tags={false}
                          />
                        )
                      })}
                    </Stack>
                  </Stack>
                </ContentBlock>
              </Box>
            </div>
          </Box>
        </div>
      </Box>
    </ContentBlock>
  )
}

export default CategoryPage
