import { BLOCKS } from '@contentful/rich-text-types'
import { theme } from '@island.is/island-ui/theme'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Text,
} from '@island.is/island-ui/core'
import type { SliceType } from '@island.is/island-ui/contentful'
import type { FooterItem } from '@island.is/web/graphql/schema'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { webRichText } from '@island.is/web/utils/richText'

import * as styles from './ThjodskjalasafnFooter.css'
import LogoWithBg from './LogoWithBg'

interface FooterProps {
  heading: string
  columns: FooterItem[]
}

export const ThjodskjalasafnFooter = ({ heading, columns }: FooterProps) => {
  const { width } = useWindowSize()

  const isMobileScreenWidth = width < theme.breakpoints.sm

  const items = columns.map((column, index) => (
    <GridColumn
      key={index}
      span={isMobileScreenWidth ? '1/1' : `${columns.length < 4 ? 4 : 3}/12`}
      paddingBottom={3}
    >
      <Box>
        {column.title && (
          <Text color="white" fontWeight="semiBold" marginBottom={1}>
            <Hyphen>{column.title}</Hyphen>
          </Text>
        )}
        {webRichText((column?.content ?? []) as SliceType[], {
          renderNode: {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore make web strict
            [BLOCKS.PARAGRAPH]: (_node, children) => {
              return (
                <Text color="white" variant="medium" marginBottom={1}>
                  {children}
                </Text>
              )
            },
          },
        })}
      </Box>
    </GridColumn>
  ))

  return (
    <Box component="footer" className={styles.footer} paddingTop={5}>
      <GridContainer>
        <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            paddingBottom={5}
            marginBottom={5}
            borderColor="white"
            borderBottomWidth="standard"
          >
            <Box hidden={isMobileScreenWidth} marginRight={4}>
              <LogoWithBg />
            </Box>
            <Text variant="h2" color="white">
              {heading}
            </Text>
          </Box>
          <GridRow
            className={isMobileScreenWidth ? undefined : styles.alignItems}
          >
            {items}
          </GridRow>
        </Box>
      </GridContainer>
    </Box>
  )
}

export default ThjodskjalasafnFooter
