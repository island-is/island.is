/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import cn from 'classnames'
import chunk from 'lodash/chunk'
import { Box } from '../Box/Box'
import { Logo } from '../Logo/Logo'
import { Tiles } from '../Tiles/Tiles'
import { Typography } from '../Typography/Typography'
import { Inline } from '../Inline/Inline'
import { Tag } from '../Tag/Tag'
import { Icon } from '../Icon/Icon'
import { GridContainer, GridRow, GridColumn } from '../Grid'

import * as styles from './Footer.treat'
import { ExternalLink, Link } from '../Link'

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
  hideLanguageSwith?: boolean
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
  hideLanguageSwith = false,
}: FooterProps) => {
  return (
    <>
      <Box width="full" background="blue100" paddingY={6}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <Box paddingBottom={5}>
                <Logo iconOnly id="footer_logo" />
              </Box>
            </GridColumn>
            <GridColumn
              span={['12/12', '12/12', '3/12']}
              paddingBottom={[4, 4, 0]}
              className={styles.withDecorator}
            >
              <div>
                {topLinks.map(({ title, href }, index) => (
                  <Typography key={index} variant="h3" paddingBottom={3}>
                    <Link href={href} color="blue400" withUnderline>
                      {title}
                    </Link>
                  </Typography>
                ))}
                {!hideLanguageSwith && (
                  <Box paddingBottom={3}>
                    <Inline space={1} alignY="center">
                      <Icon
                        height="15"
                        width="15"
                        type="globe"
                        color="blue400"
                      />
                      <Typography variant="h5">
                        <Link color="blue400" href={languageSwitchLink.href}>
                          {languageSwitchLink.title}
                        </Link>
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
                    <Typography variant="h5">
                      <Link
                        color="blue400"
                        href="https://www.facebook.com/islandid"
                      >
                        Facebook
                      </Link>
                    </Typography>
                  </Inline>
                </Box>
              </div>
            </GridColumn>
            {showMiddleLinks ? (
              <GridColumn
                span={['12/12', '12/12', '6/12']}
                paddingBottom={[4, 4, 0]}
                paddingTop={[6, 6, 0]}
                className={styles.withDecorator}
              >
                <div>
                  {middleLinksTitle ? (
                    <Typography
                      variant="eyebrow"
                      color="purple400"
                      paddingBottom={3}
                    >
                      {middleLinksTitle}
                    </Typography>
                  ) : null}
                  <Tiles space={2} columns={[1, 2, 2, 2, 2]}>
                    {middleLinks.map(({ title, href }, index) => {
                      return (
                        <Typography key={index} variant="h5">
                          <Link href={href} color="blue400" withUnderline>
                            {title}
                          </Link>
                        </Typography>
                      )
                    })}
                  </Tiles>
                </div>
              </GridColumn>
            ) : null}
            {showTagLinks ? (
              <GridColumn
                span={['12/12', '12/12', '3/12']}
                paddingTop={[6, 6, 0]}
              >
                {tagLinksTitle ? (
                  <Typography
                    variant="eyebrow"
                    color="purple400"
                    paddingBottom={3}
                  >
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
              </GridColumn>
            ) : null}
          </GridRow>
        </GridContainer>
      </Box>
      <Box background="blue400" paddingTop={6} paddingBottom={4}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <Typography variant="eyebrow" color="white" paddingBottom={3}>
                Aðrir opinberir vefir
              </Typography>
            </GridColumn>
          </GridRow>
          <GridRow>
            {chunk(bottomLinks, Math.ceil(bottomLinks.length / 4)).map(
              (group) =>
                group.map(({ title, href }) => {
                  return (
                    <GridColumn
                      key={href}
                      span={['12/12', '6/12', '4/12', '3/12']}
                    >
                      <Typography variant="h5" color="white" paddingBottom={3}>
                        <ExternalLink href={href}> {title}</ExternalLink>
                      </Typography>
                    </GridColumn>
                  )
                }),
            )}
          </GridRow>
        </GridContainer>
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

export default Footer
