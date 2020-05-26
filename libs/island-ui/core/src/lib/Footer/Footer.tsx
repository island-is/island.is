import React, { FC } from 'react'
import { Logo } from '../Logo/Logo'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'
import { Columns } from '../Columns/Columns'
import { Column } from '../Column/Column'
import { Stack } from '../Stack/Stack'
import { Typography } from '../Typography/Typography'
import { VariantTypes } from '../Typography/Typography.treat'
import * as styles from './Footer.treat'

const isLinkInternal = (to) => {
  // If it's a relative url such as '/path', 'path' and does not contain a protocol we can assume it is internal.
  if (to.indexOf('://') === -1) return true

  return false
}

interface LinkProps {
  href: string
  variant?: VariantTypes
}

// Temporary link component
const FooterLink: FC<LinkProps> = ({
  href,
  variant = 'footerLink',
  children,
}) => {
  const content = (
    <Typography variant={variant} as="span">
      {children}
    </Typography>
  )

  return isLinkInternal(href) ? (
    <a href={href}>{content}</a>
  ) : (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.link}
    >
      {content}
      <LinkIcon />
    </a>
  )
}

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <Box background="blue400">
        <ContentBlock>
          <Box paddingY={6} padding={['gutter', 'containerGutter']}>
            <Columns space="gutter" collapseBelow="lg">
              <Column width="1/12">
                <Logo iconOnly solid />
              </Column>
              <Column width="3/12">
                <FooterLink
                  href="https://stafraent.island.is/"
                  variant="footerLinkLarge"
                >
                  Um Stafrænt Ísland
                </FooterLink>
              </Column>
              <Column width="3/12">
                <FooterLink
                  href="https://island.is/um-island-is/hafa-samband/"
                  variant="footerLinkLarge"
                >
                  Hafa samband
                </FooterLink>
              </Column>
              <Column width="3/12">
                <FooterLink
                  href="https://island.is/en"
                  variant="footerLinkLarge"
                >
                  English
                </FooterLink>
              </Column>
            </Columns>
          </Box>
        </ContentBlock>
      </Box>
      <Box background="blue600">
        <ContentBlock>
          <Box paddingY={[3, 3, 3, 6]} paddingX={['gutter', 'containerGutter']}>
            <Columns space="gutter" collapseBelow="lg">
              <Column width="1/12">
                <span />
              </Column>
              <Column width="3/12">
                <Stack space="gutter">
                  <FooterLink href="https://minarsidur.island.is/">
                    Mínar síður
                  </FooterLink>
                  <FooterLink href="https://www.heilsuvera.is/">
                    Heilsuvera
                  </FooterLink>
                  <FooterLink href="https://opinbernyskopun.island.is/">
                    Opinber nýsköpun
                  </FooterLink>
                </Stack>
              </Column>
              <Column width="3/12">
                <Stack space="gutter">
                  <FooterLink href="https://samradsgatt.island.is/">
                    Samráðsgátt
                  </FooterLink>
                  <FooterLink href="https://island.is/mannanofn/">
                    Mannanöfn
                  </FooterLink>
                  <FooterLink href="http://vefur.island.is/undirskriftalistar">
                    Undirskriftarlistar
                  </FooterLink>
                </Stack>
              </Column>
              <Column width="3/12">
                <Stack space="gutter">
                  <FooterLink href="https://island.is/um-island-is/algengar-spurningar/">
                    Algengar spurningar
                  </FooterLink>
                  <FooterLink href="http://www.opnirreikningar.is/">
                    Opnir reikningar ríkisins
                  </FooterLink>
                  <FooterLink href="https://tekjusagan.is/">
                    Tekjusagan
                  </FooterLink>
                </Stack>
              </Column>
            </Columns>
          </Box>
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
