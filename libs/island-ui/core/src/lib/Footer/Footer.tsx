/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import chunk from 'lodash/chunk'

import { Divider } from '../Divider/Divider'
import { Box } from '../Box/Box'
import { Logo } from '../Logo/Logo'
import { Tiles } from '../Tiles/Tiles'
import { Text } from '../Text/Text'
import { Inline } from '../Inline/Inline'
import { Tag } from '../Tag/Tag'
import { Icon } from '../Icon/Icon'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { Link } from '../Link/Link'

import * as styles from './Footer.treat'
import { Button } from '../Button/Button'
import Hyphen from '../Hyphen/Hyphen'
import { LinkContext } from '../context/LinkContext/LinkContext'

export interface FooterLinkProps {
  title: string
  href: string
  className?: string
}

interface FooterProps {
  topLinks?: FooterLinkProps[]
  topLinksContact?: FooterLinkProps[]
  bottomLinks?: FooterLinkProps[]
  middleLinks?: FooterLinkProps[]
  tagLinks?: FooterLinkProps[]
  middleLinksTitle?: string
  tagLinksTitle?: string
  bottomLinksTitle?: string
  languageSwitchLink?: FooterLinkProps
  hideLanguageSwith?: boolean
  showMiddleLinks?: boolean
  showTagLinks?: boolean
  languageSwitchOnClick?: () => void
}

export const Footer = ({
  topLinks = defaultTopLinksInfo,
  topLinksContact = defaultTopLinksContact,
  bottomLinks = defaultBottomLinks,
  middleLinks = defaultBottomLinks,
  tagLinks = defaultBottomLinks,
  middleLinksTitle = 'Tenglar',
  tagLinksTitle = 'Flýtileiðir',
  bottomLinksTitle = 'Aðrir opinberir vefir',
  showMiddleLinks = false,
  showTagLinks = false,
  languageSwitchLink = defaultLanguageSwitchLink,
  hideLanguageSwith = false,
  languageSwitchOnClick,
}: FooterProps) => {
  return (
    <footer>
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
              paddingBottom={[4, 2, 0, 0]}
              className={styles.withDecorator}
            >
              <Box paddingRight={[0, 0, 1]}>
                <LinkContext.Provider
                  value={{
                    linkRenderer: (href, children) => (
                      <Link href={href} color="blue600" underline="normal">
                        {children}
                      </Link>
                    ),
                  }}
                >
                  {topLinks.map(({ title, href }, index) => {
                    const isLast = index + 1 === topLinks.length
                    return (
                      <Text
                        key={index}
                        variant="intro"
                        paddingBottom={isLast ? 4 : 2}
                        color={'blue600'}
                      >
                        <a href={href}>
                          <Hyphen>{title}</Hyphen>
                        </a>
                      </Text>
                    )
                  })}
                </LinkContext.Provider>
                <Box display="flex" flexDirection={'column'} paddingBottom={4}>
                  {topLinksContact.map(({ title, href }, index) => {
                    const isLast = index + 1 === topLinksContact.length
                    const isInternalLink = href.indexOf('/') === 0
                    return (
                      <Box marginBottom={isLast ? 0 : 3} key={index}>
                        <Link href={href} skipTab>
                          <Button
                            colorScheme="default"
                            icon={isInternalLink ? 'arrowForward' : undefined}
                            iconType={isInternalLink ? 'filled' : undefined}
                            size="default"
                            variant="text"
                            as="span"
                          >
                            {title}
                          </Button>
                        </Link>
                      </Box>
                    )
                  })}
                </Box>
                <Divider />
                <Box
                  paddingTop={4}
                  display="flex"
                  flexDirection="row"
                  flexWrap="wrap"
                >
                  {!hideLanguageSwith && (
                    <Box marginRight={3}>
                      <Inline space={1} alignY="center">
                        <Icon
                          height="15"
                          width="15"
                          type="globe"
                          color="blue400"
                        />
                        <Text variant="h5" color="blue600" fontWeight="light">
                          <Link
                            href={languageSwitchLink.href}
                            onClick={languageSwitchOnClick}
                          >
                            {languageSwitchLink.title}
                          </Link>
                        </Text>
                      </Inline>
                    </Box>
                  )}
                  <Box>
                    <Inline space={1} alignY="center">
                      <Icon
                        height="15"
                        width="15"
                        type="facebook"
                        color="blue400"
                      />
                      <Text variant="h5" color="blue600" fontWeight="light">
                        <Link href="https://www.facebook.com/islandid">
                          Facebook
                        </Link>
                      </Text>
                    </Inline>
                  </Box>
                </Box>
              </Box>
            </GridColumn>
            {showMiddleLinks ? (
              <GridColumn
                span={['12/12', '12/12', '6/12']}
                paddingBottom={[4, 4, 0]}
                paddingTop={[6, 6, 0]}
                className={styles.withDecorator}
              >
                <Box paddingX={[0, 0, 1]}>
                  {middleLinksTitle ? (
                    <Text variant="eyebrow" color="blue400" paddingBottom={3}>
                      {middleLinksTitle}
                    </Text>
                  ) : null}
                  <LinkContext.Provider
                    value={{
                      linkRenderer: (href, children) => (
                        <Link href={href} color="blue400" underline="normal">
                          {children}
                        </Link>
                      ),
                    }}
                  >
                    <Tiles space={2} columns={[1, 2, 2, 2, 2]}>
                      {middleLinks.map(({ title, href }, index) => {
                        return (
                          <Text
                            key={index}
                            variant="h5"
                            color="blue600"
                            fontWeight="light"
                          >
                            <a href={href}>{title}</a>
                          </Text>
                        )
                      })}
                    </Tiles>
                  </LinkContext.Provider>
                </Box>
              </GridColumn>
            ) : null}
            {showTagLinks ? (
              <GridColumn
                span={['12/12', '12/12', '3/12']}
                paddingTop={[6, 6, 0]}
              >
                <Box paddingX={[0, 0, 1]}>
                  {tagLinksTitle ? (
                    <Text variant="eyebrow" color="blue400" paddingBottom={3}>
                      {tagLinksTitle}
                    </Text>
                  ) : null}
                  <Inline space={2}>
                    {tagLinks.map(({ title, href }, index) => {
                      return (
                        <Tag
                          key={index}
                          variant="white"
                          {...(href && href.startsWith('/')
                            ? {
                                CustomLink: ({ children, ...props }) => (
                                  <Link key={title} {...props} href={href}>
                                    {children}
                                  </Link>
                                ),
                              }
                            : { href })}
                        >
                          {title}
                        </Tag>
                      )
                    })}
                  </Inline>
                </Box>
              </GridColumn>
            ) : null}
          </GridRow>
        </GridContainer>
      </Box>
      {}
      <Box paddingY={4}>
        <GridContainer>
          <GridRow>
            <GridColumn span="12/12">
              <Text variant="eyebrow" color="blue400" paddingBottom={3}>
                {bottomLinksTitle}
              </Text>
            </GridColumn>
          </GridRow>
          <GridRow>
            <LinkContext.Provider
              value={{
                linkRenderer: (href, children) => (
                  <Link href={href} underline="normal">
                    {children}
                  </Link>
                ),
              }}
            >
              {chunk(bottomLinks, Math.ceil(bottomLinks.length / 4)).map(
                (group) =>
                  group.map(({ title, href }) => {
                    return (
                      <GridColumn
                        key={href}
                        span={['12/12', '6/12', '4/12', '3/12']}
                      >
                        <Text
                          variant="h5"
                          fontWeight="light"
                          color="blue600"
                          paddingBottom={2}
                        >
                          <a href={href}>{title}</a>
                        </Text>
                      </GridColumn>
                    )
                  }),
              )}
            </LinkContext.Provider>
          </GridRow>
        </GridContainer>
      </Box>
    </footer>
  )
}

const defaultTopLinksInfo = [
  {
    title: 'Um Stafrænt Ísland',
    href: 'https://stafraent.island.is/',
  },
  {
    title: 'Stofnanir',
    href: '/stofnanir',
  },
  {
    title: 'Vörur og þjónusta Ísland.is',
    href: 'https://island.is/flokkur/vorur-og-thjonusta-island-is',
  },
]

const defaultTopLinksContact = [
  {
    title: 'Hafa samband',
    href: '/s/stafraent-island/hafa-samband',
  },
  {
    title: 'Sími: 426 5500',
    href: 'tel:+3544265500',
  },
]

const defaultLanguageSwitchLink = {
  title: 'English',
  href: 'https://island.is/en',
}

const defaultBottomLinks = [
  {
    title: 'Mínar síður',
    href: 'https://minarsidur.island.is/',
  },
  {
    title: 'Heilsuvera',
    href: 'https://www.heilsuvera.is/',
  },
  {
    title: 'Opinber nýsköpun',
    href: 'https://opinbernyskopun.island.is/',
  },
  {
    title: 'Samráðsgátt',
    href: 'https://samradsgatt.island.is/',
  },
  {
    title: 'Mannanöfn',
    href: 'https://island.is/mannanofn/',
  },
  {
    title: 'Undirskriftarlistar',
    href: 'http://vefur.island.is/undirskriftalistar',
  },
  {
    title: 'Algengar spurningar',
    href: 'https://island.is/stafraent-island/algengar-spurningar/',
  },
  {
    title: 'Opnir reikningar ríkisins',
    href: 'http://www.opnirreikningar.is/',
  },
  {
    title: 'Tekjusagan',
    href: 'https://tekjusagan.is/',
  },
]
