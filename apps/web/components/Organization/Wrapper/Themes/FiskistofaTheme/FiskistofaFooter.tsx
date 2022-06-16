import React from 'react'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'

import * as styles from './FiskistofaFooter.css'

interface FiskistofaFooterProps {
  footerItems: FooterItem[]
}

export const FiskistofaFooter = ({ footerItems }: FiskistofaFooterProps) => {
  return (
    <footer aria-labelledby="fiskistofa-footer">
      <Box className={styles.container}>
        <GridContainer className={styles.mainColumn}>
          <GridColumn>
            <GridRow>
              <Box marginLeft={2}>
                <img
                  src="https://images.ctfassets.net/8k0h54kbe6bj/2JSIJ4WbQ4Up84KQlMnIBb/34c1a74806884e456e3ab809a54d41f6/fiskistofa-footer-logo.png"
                  alt="fiskistofa-logo"
                />
              </Box>
            </GridRow>
            <GridRow marginTop={2}>
              {footerItems.slice(0, 3).map((item) => (
                <GridColumn>
                  <Text fontWeight="semiBold" marginBottom={2}>
                    <Hyphen>{item.title}</Hyphen>
                  </Text>
                  {richText(item.content as SliceType[])}
                </GridColumn>
              ))}

              {footerItems[3] && (
                <GridColumn className={styles.linkContainer}>
                  {richText(footerItems[3].content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (_node, children) => (
                        <Text>{children}</Text>
                      ),
                    },
                  })}
                  <Box className={styles.iconContainer}>
                    <img
                      src="https://images.ctfassets.net/8k0h54kbe6bj/7076IkepUKnI8eKHbo69Ys/40d84cf75b177a8bef7beb1f6d45f6cd/fiskistofa-jafnlaunavottun.png"
                      alt="fiskistofa-jafnlaunavottun"
                      width={100}
                      height={100}
                    />
                    <img
                      src="https://images.ctfassets.net/8k0h54kbe6bj/71f5kkbe52Y21n62JfdxlQ/bd5c7f87d582ab1cd74b6e6ca61d6890/fiskistofa-bsi.png"
                      alt="fiskistofa-bsi"
                      className={styles.bsiLogo}
                    />
                  </Box>
                </GridColumn>
              )}
            </GridRow>
          </GridColumn>
        </GridContainer>
      </Box>
    </footer>
  )
}

export default FiskistofaFooter
