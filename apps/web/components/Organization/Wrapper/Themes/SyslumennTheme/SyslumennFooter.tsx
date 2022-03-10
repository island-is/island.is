import React, { FC, useContext } from 'react'
import { FooterItem } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Link,
  LinkContext,
  LinkProps,
  Text,
} from '@island.is/island-ui/core'
import { LinkType, useLinkResolver } from '@island.is/web/hooks'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { GlobalContext } from '@island.is/web/context'
import { BLOCKS } from '@contentful/rich-text-types'

import * as styles from './SyslumennFooter.css'

interface FooterProps {
  title: string
  logo?: string
  footerItems: Array<FooterItem>
}

export const SyslumennFooter: React.FC<FooterProps> = ({
  title,
  logo,
  footerItems,
}) => {
  const { isServiceWeb, shouldLinkToServiceWeb } = useContext(GlobalContext)

  const items = footerItems.map((item, index) => (
    <GridColumn
      key={index}
      span={['12/12', '6/12', '4/12', '1/5']}
      className={index === 0 ? styles.footerItemFirst : null}
    >
      <Box marginBottom={5}>
        <Box marginBottom={2}>
          {isServiceWeb && item.link ? (
            <HeaderLink slug={item.link.url} underline="small">
              {item.title}
            </HeaderLink>
          ) : (
            <Text fontWeight="semiBold" color="white">
              <Hyphen>{item.title}</Hyphen>
            </Text>
          )}
        </Box>
        {richText(
          (isServiceWeb ? item.serviceWebContent : item.content) as SliceType[],
          {
            renderNode: {
              [BLOCKS.PARAGRAPH]: (_node, children) => (
                <Text variant="small" color="white">
                  {children}
                </Text>
              ),
            },
          },
        )}
      </Box>
    </GridColumn>
  ))

  return (
    <Box
      component="footer"
      aria-labelledby="organizationFooterTitle"
      className={styles.footerBg}
      paddingTop={5}
    >
      <GridContainer>
        <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            paddingBottom={5}
            marginBottom={5}
            borderColor="blueberry300"
            borderBottomWidth="standard"
          >
            {!!logo && (
              <Box marginRight={4}>
                <img src={logo} alt="" width="70" />
              </Box>
            )}
            <div id="organizationFooterTitle">
              <Text variant="h2" color="white">
                {title}
              </Text>
            </div>
          </Box>
          <GridRow>
            {!shouldLinkToServiceWeb || isServiceWeb ? (
              items
            ) : (
              <>
                <GridColumn span={['12/12', '12/12', '1/5']} paddingBottom={4}>
                  <HeaderLink
                    linkType="serviceweborganization"
                    slug="syslumenn"
                  >
                    Spurningar og svör
                  </HeaderLink>
                </GridColumn>
                <GridColumn span={['12/12', '12/12', '4/5']}>
                  <GridContainer>
                    <GridRow>{items}</GridRow>
                  </GridContainer>
                </GridColumn>
              </>
            )}
          </GridRow>
        </Box>
      </GridContainer>
    </Box>
  )
}

interface HeaderLink {
  linkType?: LinkType
  underline?: LinkProps['underline']
  slug: string
}

const HeaderLink: FC<HeaderLink> = ({
  linkType,
  slug,
  children,
  underline = 'normal',
}) => {
  const { linkResolver } = useLinkResolver()

  return (
    <LinkContext.Provider
      value={{
        linkRenderer: (href, children) => (
          <Link
            href={href}
            underline={underline}
            underlineVisibility="always"
            skipTab
          >
            {children}
          </Link>
        ),
      }}
    >
      <Text fontWeight="semiBold" color="white">
        <a href={linkType ? linkResolver(linkType, slug && [slug]).href : slug}>
          {typeof children === 'string' ? (
            <Hyphen>{children}</Hyphen>
          ) : (
            children
          )}
        </a>
      </Text>
    </LinkContext.Provider>
  )
}
