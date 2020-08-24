/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import cn from 'classnames'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { Logo } from '../Logo/Logo'
import { Stack } from '../Stack/Stack'
import { Tiles } from '../Tiles/Tiles'
import { Typography } from '../Typography/Typography'
import { Inline } from '../Inline/Inline'
import { Tag } from '../Tag/Tag'
import { Icon } from '../Icon/Icon'

import * as styles from './FooterNew.treat'

interface FooterLinkProps {
  title: string
  href: string
  className?: string
}

interface FooterNewProps {
  topLinks?: FooterLinkProps[]
  bottomLinks?: FooterLinkProps[]
  languageSwitchLink?: FooterLinkProps
  hideLanguageSwith?: boolean
}

export const FooterNew = ({
  topLinks = defaultTopLinks,
  bottomLinks = defaultBottomLinks,
  languageSwitchLink = defaultLanguageSwitchLink,
  hideLanguageSwith = false,
}: FooterNewProps) => {
  return (
    <>
      <Box width="full" background="blue100" className={styles.topWrapper}>
        <ContentBlock>
          <Box padding={[3, 3, 6]}>
            <Box marginBottom={[3, 3, 6]}>
              <Logo iconOnly id="footer_logo" />
            </Box>
            <div className={styles.columns}>
              <div className={cn(styles.column, styles.columnBorder)}>
                <Stack space={3}>
                  <Stack space={3}>
                    {topLinks.map(({ title, href }, index) => (
                      <Typography key={index} variant="h3" color="blue400">
                        <a href={href}>{title}</a>
                      </Typography>
                    ))}
                  </Stack>
                  <Stack space={2}>
                    {!hideLanguageSwith && (
                      <Inline space={1} alignY="center">
                        <Icon
                          height="15"
                          width="15"
                          type="globe"
                          color="blue400"
                        />
                        <Typography variant="h5" color="blue400">
                          <a href={languageSwitchLink.href}>
                            {languageSwitchLink.title}
                          </a>
                        </Typography>
                      </Inline>
                    )}
                    <Inline space={1} alignY="center">
                      <Icon
                        height="15"
                        width="15"
                        type="facebook"
                        color="blue400"
                      />
                      <Typography variant="h5" color="blue400">
                        <a href="https://www.facebook.com/islandid">Facebook</a>
                      </Typography>
                    </Inline>
                    <Inline space={1} alignY="center">
                      <Icon
                        height="15"
                        width="15"
                        type="user"
                        color="blue400"
                      />
                      <Typography variant="h5" color="blue400">
                        <a href="#">Persónuverndarstefna</a>
                      </Typography>
                    </Inline>
                  </Stack>
                </Stack>
              </div>
              <div
                className={cn(
                  styles.column,
                  styles.columnLarge,
                  styles.columnBorder,
                )}
              >
                <Stack space={3}>
                  <Stack space={3}>
                    <Typography variant="eyebrow" color="purple400">
                      Þjónustuflokkar
                    </Typography>
                    <Tiles space={2} columns={[1, 2, 2, 1, 2]}>
                      {categories.map(({ title }) => {
                        return (
                          <Typography variant="h5" color="blue400">
                            <a href="#">{title}</a>
                          </Typography>
                        )
                      })}
                    </Tiles>
                  </Stack>
                </Stack>
              </div>
              <div className={styles.column}>
                <Stack space={3}>
                  <Stack space={3}>
                    <Typography variant="eyebrow" color="purple400">
                      Flýtileiðir
                    </Typography>
                    <Inline space={2}>
                      {categories.map(({ title }) => {
                        return <Tag variant="white">{title}</Tag>
                      })}
                    </Inline>
                  </Stack>
                </Stack>
              </div>
            </div>
          </Box>
        </ContentBlock>
      </Box>
      <Box width="full" background="blue400" className={styles.bottomWrapper}>
        <ContentBlock>
          <Box width="full">
            <Box padding={[3, 3, 6]}>
              <Stack space={3}>
                <Stack space={3}>
                  <Typography variant="eyebrow" color="white">
                    Aðrir opinberir vefir
                  </Typography>
                  <Tiles space={2} columns={[1, 1, 2, 3, 4]}>
                    {bottomLinks.map(({ title, href }, index) => {
                      return (
                        <Typography key={index} variant="h5" color="white">
                          <a href={href}>
                            {title}{' '}
                            <Icon width="12" type="external" color="white" />
                          </a>
                        </Typography>
                      )
                    })}
                  </Tiles>
                </Stack>
              </Stack>
            </Box>
          </Box>
        </ContentBlock>
      </Box>
    </>
  )
}

const defaultTopLinks = [
  {
    title: 'Um Stafrænt Ísland',
    href: 'https://stafraent.island.is/',
  },
  {
    title: 'Stofnanir',
    href: '#',
  },
  {
    title: 'Hafa samband',
    href: 'https://island.is/um-island-is/hafa-samband/',
  },
]

const defaultLanguageSwitchLink = {
  title: 'English',
  href: 'https://island.is/en',
}

const defaultBottomLinks = [
  {
    href: 'https://minarsidur.island.is/',
    title: 'Mínar síður',
  },
  {
    href: 'https://www.heilsuvera.is/',
    title: 'Heilsuvera',
  },
  {
    href: 'https://opinbernyskopun.island.is/',
    title: 'Opinber nýsköpun',
  },
  {
    href: 'https://samradsgatt.island.is/',
    title: 'Samráðsgátt',
  },
  {
    href: 'https://island.is/mannanofn/',
    title: 'Mannanöfn',
  },
  {
    href: 'http://vefur.island.is/undirskriftalistar',
    title: 'Undirskriftarlistar',
  },
  {
    href: 'https://island.is/um-island-is/algengar-spurningar/',
    title: 'Algengar spurningar',
  },
  {
    href: 'http://www.opnirreikningar.is/',
    title: 'Opnir reikningar ríkisins',
  },
  {
    href: 'https://tekjusagan.is/',
    title: 'Tekjusagan',
  },
]

const categories = [
  {
    title: 'Fjölskyldumál og velferð',
    description:
      'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.',
  },
  {
    title: 'Eldri borgarar',
    description: 'Þjónusta, réttindi og lífeyrismál.',
  },
  {
    title: 'Bætur',
    description: 'Bótagreiðslur til einstaklinga frá ríki og sveitarfélögum.',
  },
  {
    title: 'Málefni fatlaðra',
    description: 'Réttindi, bætur, jafnrétti og umönnun.',
  },
  {
    title: 'Menntun',
    description:
      'Leikskólar, grunnskólar, framhaldsskólar, háskólar, styrkir og lán.',
  },
  {
    title: 'Ferðalög og búseta erlendis',
    description: 'Útgáfa vegabréfa, evrópska sjúkrakortið, störf erlendis.',
  },
  {
    title: 'Fjölskyldumál og velferð',
    description:
      'Meðal annars fæðingarorlof, nöfn, forsjá, gifting og skilnaður.',
  },
]

export default FooterNew
