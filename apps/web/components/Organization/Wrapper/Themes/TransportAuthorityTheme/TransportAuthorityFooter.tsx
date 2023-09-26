import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { webRichText } from '@island.is/web/utils/richText'
import { useWindowSize } from '@island.is/web/hooks/useViewport'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './TransportAuthorityFooter.css'

interface TransportAuthorityFooterProps {
  title: string
  footerItems?: FooterItem[]
  logo?: string
}

const TransportAuthorityFooter = ({
  title,
  footerItems,
  logo,
}: TransportAuthorityFooterProps) => {
  const { width } = useWindowSize()
  const shouldWrap = width < theme.breakpoints.xl

  return (
    <footer className={styles.footer} aria-labelledby="samgongustofa-footer">
      <GridContainer>
        <GridColumn>
          <GridRow alignItems="center">
            <Box>
              <img width={80} src={logo} alt="" />
            </Box>
            <Text variant="h2" as="div" color="blueberry600">
              {title}
            </Text>
          </GridRow>
        </GridColumn>

        <Box
          borderTopWidth="standard"
          borderColor="blueberry600"
          marginBottom={3}
          marginTop={3}
        />

        <GridRow>
          {(footerItems ?? []).map((item, index) => {
            if (!shouldWrap) {
              return (
                <Box
                  key={index}
                  marginLeft={index === 0 ? 12 : 0}
                  marginRight={8}
                >
                  <Box marginBottom={2}>
                    <Text fontWeight="semiBold">{item.title}</Text>
                  </Box>
                  {webRichText(item.content as SliceType[])}
                </Box>
              )
            }
            return (
              <GridColumn span={'1/1'} key={index}>
                <Box marginBottom={3} marginLeft={[10, 10, 7, 10]}>
                  <Box marginBottom={2}>
                    <Text fontWeight="semiBold">{item.title}</Text>
                  </Box>
                  {webRichText(item.content as SliceType[])}
                </Box>
              </GridColumn>
            )
          })}
        </GridRow>
      </GridContainer>
    </footer>
  )
}

export default TransportAuthorityFooter
