import React, { FC } from 'react'
import { Logo } from '../Logo/Logo'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Columns } from '../Columns/Columns'
import { Column } from '../Column/Column'
import { Tiles } from '../Tiles/Tiles'
import * as styles from './Footer.treat'
import { Hidden } from '../Hidden/Hidden'

const isLinkInternal = (to) => {
  // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.
  if (to.indexOf('://') === -1) return true

  return false
}

export interface LinkProps {
  title: string
  href: string
  className?: string
}

// Temporary link component
const FooterLink: FC<Omit<LinkProps, 'title'>> = ({
  href,
  className,
  children,
}) => {
  return isLinkInternal(href) ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
      <LinkIcon />
    </a>
  )
}

const defaultTopLinks = [
  {
    title: 'Um Stafrænt Ísland',
    href: 'https://stafraent.island.is/',
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

interface FooterProps {
  topLinks?: LinkProps[]
  bottomLinks?: LinkProps[]
  languageSwitchLink?: LinkProps
  hideLanguageSwith?: boolean
}

export const Footer = ({
  topLinks = defaultTopLinks,
  bottomLinks = defaultBottomLinks,
  languageSwitchLink = defaultLanguageSwitchLink,
  hideLanguageSwith = false,
}: FooterProps) => {
  return (
    <footer className={styles.footer}>
      <Box background="blue400" paddingX="gutter">
        <ContentBlock>
          <Box paddingY={6}>
            <Columns collapseBelow="md" space="gutter">
              <Column width="1/12">
                <Box
                  display="flex"
                  justifyContent="spaceBetween"
                  marginBottom="gutter"
                >
                  <Logo iconOnly solid />
                  {!hideLanguageSwith && (
                    <Hidden above="sm">
                      <FooterLink
                        href={languageSwitchLink.href}
                        className={styles.link}
                      >
                        <strong>{languageSwitchLink.title}</strong>
                      </FooterLink>
                    </Hidden>
                  )}
                </Box>
              </Column>
              <Column width="11/12">
                <Tiles columns={[1, 2, 3]} space="gutter">
                  {topLinks.map((link, index) => (
                    <FooterLink
                      key={index}
                      href={link.href}
                      className={styles.linkLarge}
                    >
                      {link.title}
                    </FooterLink>
                  ))}
                  {!hideLanguageSwith && (
                    <Hidden below="md">
                      <FooterLink
                        href={languageSwitchLink.href}
                        className={styles.link}
                      >
                        <strong>{languageSwitchLink.title}</strong>
                      </FooterLink>
                    </Hidden>
                  )}
                </Tiles>
              </Column>
            </Columns>
          </Box>
        </ContentBlock>
      </Box>
      <Box background="blue600" paddingX="gutter">
        <ContentBlock>
          <Columns align="right" collapseBelow="md" space="gutter">
            <Column width="11/12">
              <Box paddingY={[3, 3, 3, 6]}>
                <Tiles columns={[1, 2, 3]} space="gutter">
                  {bottomLinks.map((link, index) => (
                    <FooterLink
                      key={index}
                      className={styles.link}
                      href={link.href}
                    >
                      {link.title}
                    </FooterLink>
                  ))}
                </Tiles>
              </Box>
            </Column>
          </Columns>
        </ContentBlock>
      </Box>
    </footer>
  )
}

const LinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    viewBox="0 0 18 18"
    className={styles.icon}
  >
    <path
      fill="#FFFFFF"
      d="M0 10h2V8H0v2zm0 4h2v-2H0v2zm2 4v-2H0a2 2 0 002 2zM0 6h2V4H0v2zm12 12h2v-2h-2v2zm4-18H6a2 2 0 00-2 2v10a2 2 0 002 2h10c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm-1 12H7c-.55 0-1-.45-1-1V3c0-.55.45-1 1-1h8c.55 0 1 .45 1 1v8c0 .55-.45 1-1 1zm-7 6h2v-2H8v2zm-4 0h2v-2H4v2z"
    ></path>
  </svg>
)

export default Footer
