import cn from 'classnames'
import { ReactNode } from 'react'
import { INLINES } from '@contentful/rich-text-types'
import { Box, GridContainer, Link, Text } from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { SliceType } from '@island.is/island-ui/contentful'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './LandingPageFooter.css'

interface LandingPageFooterProps {
  footerItems?: FooterItem[]
}

const LandingPageFooter: React.FC<
  React.PropsWithChildren<LandingPageFooterProps>
> = ({ footerItems }) => {
  if (!footerItems?.length) return null

  return (
    <Box background="blue200" paddingY={2}>
      <GridContainer>
        <Box className={styles.container}>
          {footerItems.map((item, index) =>
            index === 0 ? (
              <Box key={`${item.id}-${index}`} className={styles.item}>
                <Text fontWeight="semiBold">{item.title}</Text>
              </Box>
            ) : (
              <Box
                className={cn({ [styles.dotBefore]: index > 0 }, styles.item)}
                key={`${item.id}-${index}`}
              >
                {item.content?.length &&
                  webRichText(item.content as SliceType[], {
                    renderNode: {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore make web strict
                      [INLINES.HYPERLINK]: (node, children: ReactNode) => (
                        <Link
                          underlineVisibility="always"
                          underline="small"
                          href={node.data.uri}
                          className={styles.item}
                        >
                          {children}
                        </Link>
                      ),
                    },
                  })}
              </Box>
            ),
          )}
        </Box>
      </GridContainer>
    </Box>
  )
}

export default LandingPageFooter
