/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import cn from 'classnames'
import chunk from 'lodash/chunk'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Box } from '../Box/Box'
import { Logo } from '../Logo/Logo'
import { Tiles } from '../Tiles/Tiles'
import { Typography } from '../Typography/Typography'
import { Inline } from '../Inline/Inline'
import { Tag } from '../Tag/Tag'
import { Icon } from '../Icon/Icon'
import { Grid } from '../Grid/Grid'
import { GridItem } from '../Grid/GridItem'

import * as styles from './Footer.treat'

export interface FooterLinkProps {
  title: string
  href: string
  className?: string
}

interface FooterProps {
  topLinks?: FooterLinkProps[]
  bottomLinks?: FooterLinkProps[]
  middleLinks?: FooterLinkProps[]
  tagLinks?: FooterLinkProps[]
  middleLinksTitle?: string
  tagLinksTitle?: string
  languageSwitchLink?: FooterLinkProps
  hideLanguageSwitch?: boolean
  showMiddleLinks?: boolean
  showTagLinks?: boolean
}

export const Footer = ({
  topLinks = defaultTopLinks,
  bottomLinks = defaultBottomLinks,
  middleLinks = defaultBottomLinks,
  tagLinks = defaultBottomLinks,
  middleLinksTitle = 'Tenglar',
  tagLinksTitle = 'Flýtileiðir',
  showMiddleLinks = false,
  showTagLinks = false,
  languageSwitchLink = defaultLanguageSwitchLink,
  hideLanguageSwitch = false,
}: FooterProps) => {
  return (
    <Box>
      <Box width="full" background="blue100" padding={[3, 3, 6]}>
        <ContentBlock>
          <Grid>
            <GridItem span={12}>
              <Box paddingBottom={5}>
                <Logo iconOnly id="footer_logo" />
              </Box>
            </GridItem>
            <GridItem span={3}>
              <div className={cn(styles.columnBorder, styles.links)}>
                {topLinks.map(({ title, href }, index) => (
                  <Typography
                    key={index}
                    variant="h3"
                    color="blue400"
                    bottom={3}
                  >
                    <a href={href}>{title}</a>
                  </Typography>
                ))}
                {!hideLanguageSwitch && (
                  <Box paddingBottom={3}>
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
                  </Box>
                )}
                <Box paddingBottom={3}>
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
                </Box>
              </div>
            </GridItem>
            {showMiddleLinks ? (
              <GridItem span={6}>
                <div className={cn(styles.columnBorder, styles.links)}>
                  {middleLinksTitle ? (
                    <Typography variant="eyebrow" color="purple400" bottom={3}>
                      {middleLinksTitle}
                    </Typography>
                  ) : null}
                  <Tiles space={2} columns={[1, 2, 2, 1, 2]}>
                    {middleLinks.map(({ title, href }, index) => {
                      return (
                        <Typography key={index} variant="h5" color="blue400">
                          <a href={href}>{title}</a>
                        </Typography>
                      )
                    })}
                  </Tiles>
                </div>
              </GridItem>
            ) : null}
            {showTagLinks ? (
              <GridItem span={3}>
                {tagLinksTitle ? (
                  <Typography variant="eyebrow" color="purple400" bottom={3}>
                    {tagLinksTitle}
                  </Typography>
                ) : null}
                <Inline space={2}>
                  {tagLinks.map(({ title, href }, index) => {
                    return (
                      <Tag key={index} href={href} variant="white">
                        {title}
                      </Tag>
                    )
                  })}
                </Inline>
              </GridItem>
            ) : null}
          </Grid>
        </ContentBlock>
      </Box>
      <Box background="blue400" paddingY={4}>
        <ContentBlock>
          <Typography variant="eyebrow" color="white" bottom={3}>
            Aðrir opinberir vefir
          </Typography>
          <Grid>
            {chunk(bottomLinks, Math.ceil(bottomLinks.length / 4)).map(
              (group) =>
                group.map(({ title, href }) => {
                  return (
                    <GridItem key={href} span={3}>
                      <Typography variant="h5" color="white" bottom={3}>
                        <a
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {title}{' '}
                          <Icon width="12" type="external" color="white" />
                        </a>
                      </Typography>
                    </GridItem>
                  )
                }),
            )}
          </Grid>
        </ContentBlock>
      </Box>
    </Box>
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

export default Footer
