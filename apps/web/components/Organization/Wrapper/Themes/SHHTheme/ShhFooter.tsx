import { ReactNode } from 'react'
import { BLOCKS } from '@contentful/rich-text-types'

import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './ShhFooter.css'

const defaultBottomIcons = [
  {
    imageWidth: '74px',
    imageHeight: '74px',
    imageSrc:
      'https://images.ctfassets.net/8k0h54kbe6bj/3g66Km5MwmHHyunZJi8J1g/fcad4851f7027eda367766058513ca76/shh30.svg',
    imageAlt: 'ssh-30',
  },
  {
    imageWidth: '28px',
    imageHeight: '64px',
    imageSrc:
      'https://images.ctfassets.net/8k0h54kbe6bj/4G9gpPv9GYfrhlL3BJ9dRQ/9ec3829abe8c7a4c55b9ee58d3d57536/Signwiki.png',
    imageAlt: 'sign-wiki',
    linkHref: 'https://is.signwiki.org/index.php/Fors%C3%AD%C3%B0a',
    linkTarget: '_blank',
  },
  {
    imageWidth: '40px',
    imageHeight: '40px',
    imageSrc:
      'https://images.ctfassets.net/8k0h54kbe6bj/1JuoLu1WST48ZUeQKqQXdr/0fcf8b9186d46157d47c609ec25235fa/Facebook-Logo-Dark_1.png',
    imageAlt: 'facebook-logo',
    linkHref:
      'https://www.facebook.com/people/Samskiptami%C3%B0st%C3%B6%C3%B0-heyrnarlausra-og-heyrnarskertra/100071230093497',
    linkTarget: '_blank',
  },
  {
    imageWidth: '47px',
    imageHeight: '33px',
    imageSrc:
      'https://images.ctfassets.net/8k0h54kbe6bj/3gLnhPbOCSNlZ2Uv0W46r4/51296f30167591987acc58db3e406b33/youtube_logo_SHH__1_.png',
    imageAlt: 'youtube-logo',
    linkHref: 'https://www.youtube.com/channel/UC8D3i7ZRjiMLM3vmQZQPsUw',
    linkTarget: '_blank',
  },
]

interface ShhFooterProps {
  title: string
  namespace: Record<string, string>
  footerItems: FooterItem[]
}

const ShhFooter = ({ title, namespace, footerItems }: ShhFooterProps) => {
  const n = useNamespace(namespace)
  const { width } = useWindowSize()

  const bottomIcons: typeof defaultBottomIcons =
    n('shhFooterBottomIcons', defaultBottomIcons) ?? []

  return (
    <>
      <Box className={styles.topBorder} />
      <footer className={styles.container}>
        <GridContainer>
          <Inline flexWrap="wrap" alignY="center">
            <img
              src={n(
                'shhFooterLogo',
                'https://images.ctfassets.net/8k0h54kbe6bj/3Ca6WTaZttLhBbvPwEDwF7/98bb6ddcbbc9f9ee9821de7ae7b341f1/SHH_logo.svg',
              )}
              width={80}
              alt=""
              className={styles.logo}
            />

            <Text variant="h2">{title}</Text>
          </Inline>

          <Box marginY={3} borderTopWidth="standard" borderColor="dark400" />

          <Hidden below="lg">
            <GridRow align="flexStart">
              <img
                style={{ visibility: 'hidden' }}
                src={n(
                  'shhFooterLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/3Ca6WTaZttLhBbvPwEDwF7/98bb6ddcbbc9f9ee9821de7ae7b341f1/SHH_logo.svg',
                )}
                width={80}
                alt=""
                className={styles.logo}
              />

              {footerItems.map((item, index) => (
                <GridColumn span="3/12" key={index}>
                  {item.title && (
                    <Text marginTop={2} fontWeight="semiBold">
                      {item.title}
                    </Text>
                  )}
                  {webRichText(item.content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (
                        _node: never,
                        children: ReactNode,
                      ) => (
                        <Text color="dark400" marginY={1}>
                          {children}
                        </Text>
                      ),
                    },
                  })}
                </GridColumn>
              ))}
            </GridRow>
          </Hidden>

          <Hidden above="md">
            <Box display="flex" padding={0}>
              <img
                style={{
                  visibility: 'hidden',
                  display: width > theme.breakpoints.md ? undefined : 'none',
                }}
                src={n(
                  'shhFooterLogo',
                  'https://images.ctfassets.net/8k0h54kbe6bj/3Ca6WTaZttLhBbvPwEDwF7/98bb6ddcbbc9f9ee9821de7ae7b341f1/SHH_logo.svg',
                )}
                width={80}
                alt=""
                className={styles.logo}
              />

              <GridColumn>
                {footerItems.map((item, index) => (
                  <GridColumn paddingTop={2} span="1/1" key={index}>
                    {item.title && (
                      <Text fontWeight="semiBold">{item.title}</Text>
                    )}
                    {webRichText(item.content as SliceType[], {
                      renderNode: {
                        [BLOCKS.PARAGRAPH]: (
                          _node: never,
                          children: ReactNode,
                        ) => (
                          <Text color="dark400" marginY={1}>
                            {children}
                          </Text>
                        ),
                      },
                    })}
                  </GridColumn>
                ))}
              </GridColumn>
            </Box>
          </Hidden>

          <Box marginTop={[3, 0]}>
            <Inline align={['center', 'right']} space={[2, 5]} alignY="center">
              {bottomIcons.map((icon, index) => {
                const imageProps = {
                  width: icon?.imageWidth,
                  height: icon?.imageHeight,
                  src: icon?.imageSrc,
                }

                const alt = icon?.imageAlt || ''

                if (!icon?.linkHref)
                  return <img key={index} {...imageProps} alt={alt} />

                return (
                  <a
                    key={index}
                    href={icon.linkHref}
                    target={icon.linkTarget || '_blank'}
                  >
                    <img {...imageProps} alt={alt} />
                  </a>
                )
              })}
            </Inline>
          </Box>
        </GridContainer>
      </footer>
    </>
  )
}

export default ShhFooter
