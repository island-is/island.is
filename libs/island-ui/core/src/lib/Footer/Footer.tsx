import React from 'react'
import { Box } from '../Box/Box'
import { Logo } from '../Logo/Logo'
import { Tiles } from '../Tiles/Tiles'
import { Text } from '../Text/Text'
import { Inline } from '../Inline/Inline'
import { Icon } from '../IconRC/Icon'
import { GridContainer } from '../Grid/GridContainer/GridContainer'
import { GridRow } from '../Grid/GridRow/GridRow'
import { GridColumn } from '../Grid/GridColumn/GridColumn'
import { Link } from '../Link/Link'
import Hyphen from '../Hyphen/Hyphen'
import { LinkContext } from '../context/LinkContext/LinkContext'
import { Tag } from '../Tag/Tag'

import * as styles from './Footer.css'

export interface FooterLinkProps {
  title: string
  href: string
  className?: string
}

interface FooterProps {
  topLinks?: FooterLinkProps[]
  middleLinks?: FooterLinkProps[]
  middleLinksTitle?: string
  showMiddleLinks?: boolean
  /**
   * Tag/chip-style shortcut links shown in the right column.
   */
  tagLinks?: FooterLinkProps[]
  tagLinksTitle?: string
  showTagLinks?: boolean
  /**
   * Bottom bar links with hardcoded icons.
   */
  bottomBarLinks: FooterLinkProps[]
}

const bottomBarIcons = ['informationCircle', 'person', 'document'] as const

export const Footer = ({
  topLinks = defaultTopLinksInfo,
  middleLinks = defaultBottomLinks,
  middleLinksTitle = 'Meira á Ísland.is',
  showMiddleLinks = false,
  tagLinks = [],
  tagLinksTitle = 'Flýtileiðir',
  showTagLinks = false,
  bottomBarLinks,
}: FooterProps) => {
  return (
    <footer>
      <Box width="full" background="blue100" paddingTop={7} paddingBottom={6}>
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '4/12', '4/12']}
              paddingBottom={[5, 5, 0]}
              className={styles.withDecorator}
            >
              <Logo iconOnly id="footer_logo" width={32} height={32} />
              <Box
                paddingRight={[0, 0, 1]}
                className={styles.topLinksContainer}
              >
                <LinkContext.Provider
                  value={{
                    linkRenderer: (href, children) => (
                      <Link href={href} color="blue600" underline="normal">
                        {children}
                      </Link>
                    ),
                  }}
                >
                  <Box className={styles.topLinksGrid}>
                    {topLinks.map(({ title, href }, index) => {
                      return (
                        <Text key={index} variant="intro" color={'blue600'}>
                          <a href={href}>
                            <Hyphen>{title}</Hyphen>
                          </a>
                        </Text>
                      )
                    })}
                  </Box>
                </LinkContext.Provider>
              </Box>
            </GridColumn>
            {showMiddleLinks && (
              <GridColumn
                span={['12/12', '12/12', '5/12', '5/12']}
                paddingBottom={[5, 5, 0]}
              >
                <Box paddingX={[0, 0, 1]} className={styles.columnTopSpace}>
                  {!!middleLinksTitle && (
                    <Text
                      as="h2"
                      variant="eyebrow"
                      color="dark400"
                      paddingBottom={2}
                    >
                      {middleLinksTitle}
                    </Text>
                  )}
                  <LinkContext.Provider
                    value={{
                      linkRenderer: (href, children) => (
                        <Link href={href} color="blue600" underline="normal">
                          {children}
                        </Link>
                      ),
                    }}
                  >
                    {showTagLinks ? (
                      <div className={styles.middleLinksGrid}>
                        {middleLinks.map(({ title, href }, index) => (
                          <Text
                            key={index}
                            variant="medium"
                            color="blue600"
                            fontWeight="light"
                          >
                            <a href={href}>{title}</a>
                          </Text>
                        ))}
                      </div>
                    ) : (
                      <Tiles space={2} columns={[1, 2, 2, 2, 3]}>
                        {middleLinks.map(({ title, href }, index) => (
                          <Text
                            key={index}
                            variant="h5"
                            color="blue600"
                            fontWeight="light"
                          >
                            <a href={href}>{title}</a>
                          </Text>
                        ))}
                      </Tiles>
                    )}
                  </LinkContext.Provider>
                </Box>
              </GridColumn>
            )}
            {showTagLinks && tagLinks.length > 0 && (
              <GridColumn span={['12/12', '12/12', '3/12', '3/12']}>
                <Box className={styles.columnTopSpace}>
                  {!!tagLinksTitle && (
                    <Text
                      as="h2"
                      variant="eyebrow"
                      color="dark400"
                      paddingBottom={2}
                    >
                      {tagLinksTitle}
                    </Text>
                  )}
                  <Inline space={1}>
                    {tagLinks.map(({ title, href }, index) => (
                      <Tag
                        key={index}
                        variant="blue"
                        whiteBackground
                        href={href}
                      >
                        {title}
                      </Tag>
                    ))}
                  </Inline>
                </Box>
              </GridColumn>
            )}
          </GridRow>
        </GridContainer>
      </Box>
      <Box className={styles.bottomBar}>
        <GridContainer>
          <Inline space={[2, 2, 5]} alignY="center">
            {bottomBarLinks.map(({ title, href }, index) => (
              <Box key={index} display="flex" alignItems="center" columnGap={1}>
                <Icon
                  size="small"
                  icon={bottomBarIcons[index] ?? 'informationCircle'}
                  type="filled"
                  color="blue600"
                />
                <Text
                  variant="medium"
                  color="blue600"
                  fontWeight={index === 0 ? 'semiBold' : 'light'}
                >
                  <Link href={href}>
                    {index === 0 ? (
                      <span className={styles.bottomBarLinkUnderline}>
                        {title}
                      </span>
                    ) : (
                      title
                    )}
                  </Link>
                </Text>
              </Box>
            ))}
          </Inline>
        </GridContainer>
      </Box>
    </footer>
  )
}

const defaultTopLinksInfo = [
  {
    title: 'Stofnanir',
    href: '/stofnanir',
  },
  {
    title: 'Þjónustuflokkar',
    href: '/flokkur',
  },
  {
    title: 'Lífsviðburðir',
    href: '/lifsvidburdir',
  },
]

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
