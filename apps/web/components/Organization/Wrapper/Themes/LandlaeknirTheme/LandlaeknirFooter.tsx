import React from 'react'
import {
  ArrowLink,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Link,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem, Slice } from '@island.is/web/graphql/schema'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'
import * as styles from './LandlaeknirFooter.css'

const renderParagraphs = (content: Slice[]) =>
  richText(content as SliceType[], {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (_node, children) => (
        <Text marginBottom={2}>{children}</Text>
      ),
    },
  })

interface LandLaeknirFooterProps {
  footerItems: Array<FooterItem>
  phone?: string
  email?: string
}

export const LandLaeknirFooter = ({
  footerItems,
  phone,
  email,
}: LandLaeknirFooterProps) => {
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <GridContainer>
        <GridColumn>
          <GridRow>
            <img
              src="https://images.ctfassets.net/8k0h54kbe6bj/3aKn7lTVtvZVVHJVPSs6Gh/bf8844713aa03d44916e98ae612ea5da/landlaeknir-heilbrigdisraduneytid.png"
              alt="landlaeknirLogo"
            />
          </GridRow>

          <GridRow marginTop={2}>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              {footerItems.slice(0, 6).map((item) => (
                <Box marginBottom={2}>
                  <Link key={item.id} href={item.link?.url}>
                    <Text fontWeight="semiBold">{item.title}</Text>
                  </Link>
                </Box>
              ))}
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              {footerItems?.[6] && (
                <Box>
                  <Text fontWeight="semiBold" marginBottom={2}>
                    <Hyphen>{footerItems[6].title}</Hyphen>
                  </Text>
                  {renderParagraphs(footerItems[6].content)}
                </Box>
              )}
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              {footerItems?.[7] && (
                <Box>
                  <Text fontWeight="semiBold" marginBottom={2}>
                    <Hyphen>{footerItems[7].title}</Hyphen>
                  </Text>
                  {renderParagraphs(footerItems[7].content)}
                </Box>
              )}
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              {footerItems.slice(8, 10).map((item) => (
                <Box>
                  <Text fontWeight="semiBold" marginBottom={2}>
                    <Hyphen>{item.title}</Hyphen>
                  </Text>
                  {renderParagraphs(item.content)}
                </Box>
              ))}
              <Box marginTop={3} marginBottom={3}>
                {phone && (
                  <Box marginBottom={1}>
                    <Text as="span">Sími:</Text>{' '}
                    <Text as="span" fontWeight="semiBold">
                      {phone}
                    </Text>
                  </Box>
                )}
                {email && (
                  <Box>
                    <Text as="span">Tölvupóstur:</Text>{' '}
                    <Text as="span" fontWeight="semiBold">
                      {email}
                    </Text>
                  </Box>
                )}
              </Box>
            </GridColumn>
          </GridRow>

          <GridRow>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <img
                  src="https://images.ctfassets.net/8k0h54kbe6bj/3vtLh2dJ55PA1Y1aOXIkM9/6c60a95ed3db8136a49e9734adbc8c7c/Jafnlaunavottun.svg"
                  alt="jafnlaunavottunLogo"
                />
                <Box>
                  <Text fontWeight="medium">Jafnlaunavottun</Text>
                  <Text fontWeight="medium">2020 - 2023</Text>
                </Box>
              </GridRow>
            </GridColumn>

            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink
                  href="https://www.facebook.com/landlaeknir"
                  color="blue400"
                >
                  Vertu vinur okkar á Facebook
                </ArrowLink>
                <img
                  src="https://images.ctfassets.net/8k0h54kbe6bj/1hx4HeCK1OFzPIjtKkMmrL/fa769439b9221a92bfb124b598494ba4/Facebook-Logo-Dark.svg"
                  alt="facebookLogo"
                />
              </GridRow>
            </GridColumn>

            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink color="blue400">
                  Vertu vinur okkar á Facebook
                </ArrowLink>
              </GridRow>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink color="blue400">
                  Vertu vinur okkar á Facebook
                </ArrowLink>
              </GridRow>
            </GridColumn>
          </GridRow>
        </GridColumn>
      </GridContainer>
    </footer>
  )
}

export default LandLaeknirFooter
