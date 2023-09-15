import { BLOCKS } from '@contentful/rich-text-types'
import { SliceType } from '@island.is/island-ui/contentful'
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
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './RikislogmadurFooter.css'
import { ReactNode } from 'react'

interface RikislogmadurFooterProps {
  footerItems: FooterItem[]
  logo?: string
  title: string
}

const RikislogmadurFooter = ({
  footerItems,
  logo,
  title,
}: RikislogmadurFooterProps) => {
  return (
    <footer className={styles.container} aria-labelledby="rikislogmadur-footer">
      <GridContainer>
        <Box className={styles.firstRow}>
          {!!logo && <img width={80} height={80} src={logo} alt="" />}
          {title && (
            <Text variant="h2" color="blueberry600">
              <Hyphen>{title}</Hyphen>
            </Text>
          )}
        </Box>

        <Box marginY={2} borderTopWidth="standard" borderColor="blueberry600" />

        <GridRow>
          <Hidden below="lg">
            <GridColumn>
              <Box className={styles.emptyBox} />
            </GridColumn>
          </Hidden>
          {footerItems.map((item, index) => (
            <GridColumn key={index}>
              <Box marginRight={8}>
                <Text
                  fontWeight="semiBold"
                  color="blueberry600"
                  marginBottom={2}
                >
                  {item.title}
                </Text>
                {webRichText(item.content as SliceType[], {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_node: never, children: ReactNode) => (
                      <Text
                        color="blueberry600"
                        variant="medium"
                        marginBottom={2}
                      >
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

export default RikislogmadurFooter
