/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { FC, ReactNode } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import cn from 'classnames'
import {
  ContentBlock,
  Box,
  Typography,
  Stack,
  Breadcrumbs,
  Hidden,
  Select,
  Button,
  Divider,
  Accordion,
  AccordionItem,
  BoxProps,
} from '@island.is/island-ui/core'
import { BorderedContent, Sidebar } from '../../components'

import * as styles from '../CategoryPage/CategoryPage.treat'

import { categories, selectOptions } from '../../json'

function ArticlePage() {
  const router = useRouter()

  const TITLE = 'Skráning nafns'
  const DESCRIPTION =
    'Tilgangur þessarar skráningar er að skrá nafngjöf barns í þjóðskrá, sbr. 2. gr. laga um mannanöfn nr. 45/1996.'

  const onChangeCategory = () => {
    router.push('/article')
  }

  return (
    <ContentBlock>
      <Box padding={[0, 0, 0, 6]}>
        <div className={cn(styles.layout, styles.reversed)}>
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

          <Box paddingRight={[0, 0, 0, 4]} width="full">
            <Content>
              <Stack space={[3, 3, 4]}>
                <Breadcrumbs>
                  <Link href="/">
                    <a>Ísland.is</a>
                  </Link>
                  <Link href="/category">
                    <a>Fjölskyldumál</a>
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
            </Content>
            <Box paddingTop={[4, 6]}>
              <Stack space={[0, 0, 0, 6]}>
                <Hidden above="md">
                  <Divider weight="regular" />
                </Hidden>
                <ArticleSection
                  top={
                    <Stack space={[2, 2]}>
                      <Typography variant="h2" as="h3">
                        Tilkynna nafnagjöf
                      </Typography>
                      <Typography variant="intro" as="p">
                        Tilkynntu nafngjöf hér og skráning tekur gildi næsta
                        virka dag.
                      </Typography>
                      <Typography variant="p" as="p">
                        Ef forsjá barns er sameiginleg tilkynnir annar
                        forsjáraðilinn nafngjöf hér. Hinn forsjáraðilinn fyllir
                        út formið Nafngjöf – staðfesting innan 3 sólarhringa. Ef
                        nafngjöf er ekki staðfest telst skráning ekki
                        fullnægjandi og verður hafnað í þjóðskrá.
                      </Typography>
                      <Typography variant="p" as="p">
                        Ef einn fer með forsjá barns fyllir hann út skráningu og
                        sendir. Ef barn hefur ekki verið feðrað þá er ekki hægt
                        að kenna það við föður.
                      </Typography>
                    </Stack>
                  }
                  bottom={
                    <Stack space={[2, 2]}>
                      <Typography variant="eyebrow" as="h4">
                        Innskráning og umsókn
                      </Typography>
                      <Typography variant="h3" as="h3">
                        Tilkynning um nafngjöf hjá Þjóðskrá
                      </Typography>
                      <Typography variant="p" as="p">
                        Skráðu þig inn með rafrænum skilríkjum. Eftir
                        innskráningu opnast innsendiform á vef Þjóðskrár.
                      </Typography>
                      <Box paddingTop={[1, 1, 2]}>
                        <Button>Áfram í innskráningu</Button>
                      </Box>
                    </Stack>
                  }
                />
                <ArticleSection
                  top={
                    <Stack space={[2, 2]}>
                      <Typography variant="h2" as="h3">
                        Staðfesting á nafngjöf
                      </Typography>
                      <Typography variant="intro" as="p">
                        Staðfestu nafngjöf hér og hún tekur gildi næsta virka
                        dag.
                      </Typography>
                      <Typography variant="p" as="p">
                        Ef forsjá barns er sameiginleg staðfestir annar
                        forsjáraðilinn nafngjöf hér. Ef nafngjöf er ekki
                        staðfest telst skráning ekki fullnægjandi og verður
                        hafnað í þjóðskrá.
                      </Typography>
                    </Stack>
                  }
                  bottom={
                    <Stack space={[2, 2]}>
                      <Typography variant="eyebrow" as="h4">
                        Innskráning og umsókn
                      </Typography>
                      <Typography variant="h3" as="h3">
                        Senda inn staðfestingu á nafngjöf
                      </Typography>
                      <Typography variant="p" as="p">
                        Skráðu þig inn með rafrænum skilríkjum. Eftir
                        innskráningu opnast innsendiform á vef Þjóðskrár.
                      </Typography>
                      <Box paddingTop={[1, 1, 2]}>
                        <Button>Áfram í innskráningu</Button>
                      </Box>
                    </Stack>
                  }
                />
                <ArticleSection
                  top={
                    <Stack space={[2, 2]}>
                      <Typography variant="h2" as="h3">
                        Beiðni til mannanafnanefndar
                      </Typography>
                      <Typography variant="intro" as="p">
                        Beiðni til mannanafnanefndar um eiginnafn eða millinafn,
                        sem ekki er á mannanafnaskrá.
                      </Typography>
                      <Typography variant="p" as="p">
                        Mannanafnanefnd tekur ekki til afgreiðslu beiðni um
                        eiginnafn eða millinafn, sem ekki er á mannanafnaskrá,
                        fyrir ófædd börn. Beiðnin verður ekki tekin til
                        afgreiðslu fyrr en greitt hefur verið tilskilið gjald,
                        kr. 3000, samkvæmt 36. tölulið 1. mgr. 14. gr laga um
                        aukatekjur ríkisjóðs nr. 88/1991, sbr. 2. gr. laga nr.
                        56/2006.
                      </Typography>
                    </Stack>
                  }
                  bottom={
                    <Stack space={[2, 2]}>
                      <Typography variant="eyebrow" as="h4">
                        Innskráning og umsókn
                      </Typography>
                      <Typography variant="h3" as="h3">
                        Senda beiðni til mannanafnanefndar
                      </Typography>
                      <Typography variant="p" as="p">
                        Skráðu þig inn með rafrænum skilríkjum. Eftir
                        innskráningu opnast innsendiform á vef Þjóðskrár.
                      </Typography>
                      <Box paddingTop={[1, 1, 2]}>
                        <Button>Áfram í innskráningu</Button>
                      </Box>
                    </Stack>
                  }
                />
              </Stack>
              <Content paddingY={[6, 6, 6, 20]}>
                <Stack space={6}>
                  <Typography variant="h2" as="h2">
                    Spurt og svarað um nafngjöf
                  </Typography>
                  <Accordion>
                    <AccordionItem label="Að tilkynna nafngjöf" id="id_1">
                      <Typography variant="p">Að tilkynna nafngjöf</Typography>
                    </AccordionItem>
                    <AccordionItem label="Nafnabreytingar" id="id_2">
                      <Typography variant="p">Nafnabreytingar</Typography>
                    </AccordionItem>
                    <AccordionItem
                      label="Nafnritun og birting í Þjóðskrá"
                      id="id_3"
                    >
                      <Typography variant="p">
                        Nafnritun og birting í Þjóðskrá
                      </Typography>
                    </AccordionItem>
                  </Accordion>
                </Stack>
              </Content>
            </Box>
          </Box>
        </div>
      </Box>
    </ContentBlock>
  )
}

interface ArticleSectionProps {
  top?: ReactNode
  bottom?: ReactNode
}

const ArticleSection: FC<ArticleSectionProps> = ({ top, bottom }) => (
  <BorderedContent
    topContent={top && <ContentBlock width="small">{top}</ContentBlock>}
    bottomContent={
      bottom && <ContentBlock width="small">{bottom}</ContentBlock>
    }
  />
)

const Content: FC<BoxProps> = ({ children, ...props }) => (
  <Box {...props}>
    <Box padding={[3, 3, 6, 0]}>
      <ContentBlock width="small">{children}</ContentBlock>
    </Box>
  </Box>
)

export default ArticlePage
