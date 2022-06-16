import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  Hyphen,
  Inline,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'
import * as styles from './HeilbrigdisstofnunNordurlandsFooter.css'

interface HeilbrigdisstofnunNordurlandsFooterProps {
  footerItems: FooterItem[]
}

export const HeilbrigdisstofnunNordurlandsFooter = ({
  footerItems,
}: HeilbrigdisstofnunNordurlandsFooterProps) => {
  console.log(footerItems)
  const renderColumn = (column: FooterItem[]) => {
    if (column.length <= 0) return null
    return (
      <GridColumn span={['6/12', '4/12', '2/12']}>
        {column.map((item) => (
          <Box key={item.id} marginBottom={2}>
            <Text fontWeight="semiBold" color="white" marginBottom={1}>
              <Hyphen>{item.title}</Hyphen>
            </Text>
            {richText(item.content as SliceType[], {
              renderNode: {
                [BLOCKS.PARAGRAPH]: (_node, children) => (
                  <Text color="white">{children}</Text>
                ),
              },
            })}
          </Box>
        ))}
      </GridColumn>
    )
  }

  return (
    <footer aria-labelledby="heilbrigdisstofnun-nordurlands-footer">
      <Box className={styles.container}>
        <GridContainer>
          <GridColumn className={styles.mainColumn}>
            <GridRow>
              {/* TODO: replace this logo */}
              <img
                src="https://images.ctfassets.net/8k0h54kbe6bj/6XdmjtueMupDLzrATChjsW/d54703724e45fd2991658efe24bb2680/1647271788_logohsn.jpeg"
                alt="heilbrigdisstofnun-nordurlands-logo"
                width={120}
              />
            </GridRow>

            <GridRow className={styles.line}>
              {renderColumn([footerItems[0]])}
              {renderColumn(footerItems.slice(1, 4))}
              {renderColumn(footerItems.slice(4, 7))}
              {renderColumn(footerItems.slice(7, 10))}
              {renderColumn(footerItems.slice(10, 13))}
              {renderColumn(footerItems.slice(13, 16))}
            </GridRow>

            <GridRow align="flexEnd" marginTop={3}>
              <Inline alignY="center" align="center" space={3}>
                <img
                  src="https://images.ctfassets.net/8k0h54kbe6bj/1igNLuoV9IQAwP1A4bfyXd/0d96a9a057e48b28616832552838c7a5/hsn-jafnlaunavottun.svg"
                  alt="jafnlaunavottun"
                  width={70}
                />
                <img
                  src="https://images.ctfassets.net/8k0h54kbe6bj/2QMl8Mw50Vj0AjlI6jzENH/cc4792e02ff1b152ede7e892da333669/greenSteps.png"
                  alt="graen-skref"
                  width={120}
                />
              </Inline>
            </GridRow>
          </GridColumn>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default HeilbrigdisstofnunNordurlandsFooter
