import { BLOCKS } from '@contentful/rich-text-types'
import { SliceType, richText } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Hyphen,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'

import * as styles from './LandskjorstjornFooter.css'

interface LandskjorstjornFooterProps {
  footerItems: FooterItem[]
}

export const LandskjorstjornFooter = ({
  footerItems,
}: LandskjorstjornFooterProps) => {
  return (
    <footer
      className={styles.container}
      aria-labelledby="landskjorstjorn-footer"
    >
      <GridContainer>
        <GridRow>
          <GridColumn>
            <img
              width={120}
              height={78}
              src="https://images.ctfassets.net/8k0h54kbe6bj/2JJGzQKfinGLSL7TnrEZij/b34ed413149e28a1c6e2f39582ad7035/landskjorstjorn-logo.png"
              alt=""
            />
          </GridColumn>
          {footerItems[0] && (
            <GridColumn>
              <Box marginLeft={[2, 0]}>
                <Text variant="h2" color="white">
                  <Hyphen>{footerItems[0].title}</Hyphen>
                </Text>
                {richText(footerItems[0].content as SliceType[], {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_node, children) => (
                      <Text
                        fontWeight="semiBold"
                        color="white"
                        variant="small"
                        marginBottom={1}
                      >
                        {children}
                      </Text>
                    ),
                  },
                })}
              </Box>
            </GridColumn>
          )}
        </GridRow>
        <Box margin={2} borderTopWidth="standard" borderColor="white" />

        <GridRow>
          <Hidden below="sm">
            <GridColumn>
              <Box className={styles.emptyBox} />
            </GridColumn>
          </Hidden>
          {footerItems.slice(1).map((item, index) => (
            <GridColumn key={index}>
              <Box marginLeft={index === 0 ? [2, 0] : 2} marginRight={8}>
                <Text fontWeight="semiBold" color="white" marginBottom={2}>
                  {item.title}
                </Text>
                {richText(item.content as SliceType[], {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_node, children) => (
                      <Text color="white" variant="medium" marginBottom={2}>
                        {children}
                      </Text>
                    ),
                  },
                })}
              </Box>
            </GridColumn>
          ))}
        </GridRow>
      </GridContainer>
    </footer>
  )
}
