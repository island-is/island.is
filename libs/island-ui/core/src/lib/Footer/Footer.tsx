import React from 'react'
import { shouldLinkOpenInNewWindow } from '@island.is/shared/utils'

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
import { Button } from '../Button/Button'
import Hyphen from '../Hyphen/Hyphen'
import { LinkContext } from '../context/LinkContext/LinkContext'
import { Stack } from '../Stack/Stack'
import { Tag } from '../Tag/Tag'

import * as styles from './Footer.css'

export interface FooterLinkProps {
  title: string
  href: string
  className?: string
}

interface FooterProps {
  topLinks?: FooterLinkProps[]
  /**
   * Contact information links.
   */
  topLinksContact?: FooterLinkProps[]
  bottomLinks?: FooterLinkProps[]
  middleLinks?: FooterLinkProps[]
  middleLinksTitle?: string
  bottomLinksTitle?: string
  languageSwitchLink?: FooterLinkProps
  privacyPolicyLink?: FooterLinkProps
  termsLink?: FooterLinkProps
  hideLanguageSwitch?: boolean
  showMiddleLinks?: boolean
  /**
   * The link to the help web. If used it will be shown instead of the contact information links.
   */
  linkToHelpWeb?: string
  linkToHelpWebText?: string
  languageSwitchOnClick?: () => void
  /**
   * Tag/chip-style shortcut links shown in the right column.
   */
  tagLinks?: FooterLinkProps[]
  tagLinksTitle?: string
  showTagLinks?: boolean
  /**
   * Bottom bar links with hardcoded icons. When provided, renders the new
   * bottom bar instead of the old "Aðrir opinberir vefir" section, and
   * simplifies the left column (removing contact/privacy/terms/language/Facebook).
   */
  bottomBarLinks?: FooterLinkProps[]
}

const bottomBarIcons = [
  'informationCircle',
  'person',
  'document',
] as const

export const Footer = ({
  topLinks = defaultTopLinksInfo,
  topLinksContact = defaultTopLinksContact,
  bottomLinks = defaultBottomLinks,
  middleLinks = defaultBottomLinks,
  middleLinksTitle = 'Meira á Ísland.is',
  bottomLinksTitle = 'Aðrir opinberir vefir',
  showMiddleLinks = false,
  languageSwitchLink = defaultLanguageSwitchLink,
  privacyPolicyLink = defaultPrivacyPolicyLink,
  termsLink = defaultTermsLink,
  hideLanguageSwitch = false,
  languageSwitchOnClick,
  tagLinks = [],
  tagLinksTitle = 'Flýtileiðir',
  showTagLinks = false,
  bottomBarLinks,
}: FooterProps) => {
  const useNewDesign = !!bottomBarLinks

  return (
    <footer>
      <Box width="full" background="blue100" paddingY={7}>
        <GridContainer>
          <GridRow>
            <GridColumn
              span={['12/12', '12/12', '4/12', '4/12']}
              paddingBottom={[5, 5, 0]}
              className={styles.withDecorator}
            >
              <Logo iconOnly id="footer_logo" width={32} height={32} />
              <Box paddingRight={[0, 0, 1]} className={styles.topLinksContainer}>
                <LinkContext.Provider
                  value={{
                    linkRenderer: (href, children) => (
                      <Link href={href} color="blue600" underline="normal">
                        {children}
                      </Link>
                    ),
                  }}
                >
                  <Box
                    className={styles.topLinksGrid}
                    paddingBottom={useNewDesign ? 0 : 4}
                  >
                    {topLinks.map(({ title, href }, index) => {
                      return (
                        <Text
                          key={index}
                          variant="intro"
                          color={'blue600'}
                        >
                          <a href={href}>
                            <Hyphen>{title}</Hyphen>
                          </a>
                        </Text>
                      )
                    })}
                  </Box>
                </LinkContext.Provider>
                {!useNewDesign && (
                  <>
                    <Box
                      display="flex"
                      flexDirection={'column'}
                      paddingBottom={4}
                    >
                      {topLinksContact.map(({ title, href }, index) => {
                        const isLast =
                          index + 1 === topLinksContact.length
                        const isInternalLink =
                          !shouldLinkOpenInNewWindow(href)
                        return (
                          <Box marginBottom={isLast ? 0 : 3} key={index}>
                            <Link href={href} skipTab>
                              <Button
                                colorScheme="default"
                                icon={
                                  isInternalLink
                                    ? 'arrowForward'
                                    : undefined
                                }
                                iconType={
                                  isInternalLink ? 'filled' : undefined
                                }
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
                    <div>
                      <Stack space={1}>
                        <Box
                          display="flex"
                          rowGap={1}
                          columnGap={1}
                          flexWrap="nowrap"
                          justifyContent="flexStart"
                        >
                          <Box className={styles.iconPaddingTop}>
                            <Icon
                              icon="informationCircle"
                              size="small"
                              color="blue400"
                              type="outline"
                            />
                          </Box>

                          <Text
                            variant="h5"
                            color="blue600"
                            fontWeight="light"
                          >
                            <Link href={privacyPolicyLink.href}>
                              {privacyPolicyLink.title}
                            </Link>
                          </Text>
                        </Box>
                        <Inline space={1} alignY="center">
                          <Icon
                            type="outline"
                            icon="document"
                            size={'small'}
                            color="blue400"
                          />
                          <Text
                            variant="h5"
                            color="blue600"
                            fontWeight="light"
                          >
                            <Link href={termsLink.href}>
                              {termsLink.title}
                            </Link>
                          </Text>
                        </Inline>
                        {!hideLanguageSwitch && (
                          <Inline space={1} alignY="center">
                            <Icon
                              size="small"
                              icon="globe"
                              type="outline"
                              color="blue400"
                            />
                            <Text
                              variant="h5"
                              color="blue600"
                              fontWeight="light"
                            >
                              <Link
                                href={languageSwitchLink.href}
                                onClick={languageSwitchOnClick}
                              >
                                {languageSwitchLink.title}
                              </Link>
                            </Text>
                          </Inline>
                        )}

                        <Inline space={1} alignY="center">
                          <Icon
                            size="small"
                            icon="facebook"
                            color="blue400"
                          />
                          <Text
                            variant="h5"
                            color="blue600"
                            fontWeight="light"
                          >
                            <Link href="https://www.facebook.com/islandid">
                              Facebook
                            </Link>
                          </Text>
                        </Inline>
                      </Stack>
                    </div>
                  </>
                )}
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
                      color={showTagLinks ? 'dark400' : 'blue400'}
                      paddingBottom={2}
                    >
                      {middleLinksTitle}
                    </Text>
                  )}
                  <LinkContext.Provider
                    value={{
                      linkRenderer: (href, children) => (
                        <Link
                          href={href}
                          color="blue600"
                          underline="normal"
                        >
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
              <GridColumn
                span={['12/12', '12/12', '3/12', '3/12']}
              >
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
                      <Tag key={index} variant="blue" whiteBackground href={href}>
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
      {bottomBarLinks ? (
        <Box paddingY={3} className={styles.bottomBar}>
          <GridContainer>
            <Inline space={[2, 2, 4]} alignY="center">
              {bottomBarLinks.map(({ title, href }, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  columnGap={1}
                >
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
      ) : (
        <Box paddingY={4}>
          <GridContainer>
            <Box paddingBottom={2}>
              <Text as="h2" variant="eyebrow" color="blue400">
                {bottomLinksTitle}
              </Text>
            </Box>
            <Box>
              <LinkContext.Provider
                value={{
                  linkRenderer: (href, children) => (
                    <Link href={href} underline="normal">
                      {children}
                    </Link>
                  ),
                }}
              >
                <Inline space={[2, 2, 4]}>
                  {bottomLinks.map(({ title, href }, index) => (
                    <Text key={index} variant="small" color="blue600">
                      <a href={href}>{title}</a>
                    </Text>
                  ))}
                </Inline>
              </LinkContext.Provider>
            </Box>
          </GridContainer>
        </Box>
      )}
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

const defaultPrivacyPolicyLink = {
  title: 'Persónuverndarstefna',
  href: '/personuverndarstefna-stafraent-islands',
}

const defaultTermsLink = {
  title: 'Skilmálar',
  href: '/skilmalar-island-is',
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
