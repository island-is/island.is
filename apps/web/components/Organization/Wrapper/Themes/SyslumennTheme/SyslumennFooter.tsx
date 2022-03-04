import React from 'react'
import { FooterItem, OrganizationPage } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './SyslumennFooter.css'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'

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
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <Box className={styles.footerBg} color="white" paddingTop={5}>
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
              {footerItems.map((item, index) => (
                <GridColumn
                  key={index}
                  span={['12/12', '6/12', '4/12', '1/5']}
                  className={index === 0 ? styles.footerItemFirst : null}
                >
                  <Box marginBottom={5}>
                    <Box marginBottom={2}>
                      {item.link ? (
                        <Link
                          href={item.link.url}
                          underline="small"
                          underlineVisibility="always"
                          color="white"
                        >
                          {item.title}
                        </Link>
                      ) : (
                        <Text
                          fontWeight={index === 0 ? 'semiBold' : 'regular'}
                          color="white"
                        >
                          {item.title}
                        </Text>
                      )}
                    </Box>
                    {richText(item.content as SliceType[], {
                      renderNode: {
                        [BLOCKS.PARAGRAPH]: (_node, children) => (
                          <Text variant="small" color="white">
                            {children}
                          </Text>
                        ),
                      },
                    })}
                  </Box>
                </GridColumn>
              ))}
            </GridRow>
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}
