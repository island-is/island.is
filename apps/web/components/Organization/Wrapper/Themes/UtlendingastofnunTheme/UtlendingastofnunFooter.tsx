import React from 'react'
import { FooterItem } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './UtlendingastofnunFooter.css'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'

interface FooterProps {
  title: string
  logo?: string
  footerItems: Array<FooterItem>
}

const UtlendingastofnunFooter: React.FC<FooterProps> = ({
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
                  <img src={logo} alt="" className={styles.logoStyle} />
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
                <GridColumn key={index} span={['12/12', '12/12', '4/12']}>
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
                        <Text color="white" fontWeight="semiBold">
                          {item.title}
                        </Text>
                      )}
                    </Box>
                    {richText(item.content as SliceType[], {
                      renderNode: {
                        [BLOCKS.PARAGRAPH]: (_node, children) => (
                          <Text color="white" paddingBottom={2}>
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

export default UtlendingastofnunFooter
