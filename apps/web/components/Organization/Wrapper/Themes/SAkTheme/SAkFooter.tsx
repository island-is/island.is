import { BLOCKS } from '@contentful/rich-text-types'

import { richText, SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Inline,
  Text,
} from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useWindowSize } from '@island.is/web/hooks/useViewport'

import * as styles from './SAkFooter.css'

interface SAkFooterProps {
  footerItems: FooterItem[]
  logo?: string
  title: string
}

const SAkFooter = ({ footerItems, logo, title }: SAkFooterProps) => {
  const { width } = useWindowSize()

  return (
    <footer className={styles.container}>
      <GridContainer>
        <Box className={styles.firstRow}>
          {!!logo && (
            <img
              width={140}
              height={80}
              src="https://images.ctfassets.net/8k0h54kbe6bj/1gOQmMTHBF7Ukz0TnfpHSu/7c27b76302855512e9a726f91c445067/sak-hvitt-trans_2.png"
              alt=""
            />
          )}
          <Text color="white" variant="h2">
            {title}
          </Text>
        </Box>

        <Box marginY={2} borderTopWidth="standard" borderColor="white" />

        <GridRow>
          <Hidden below="lg">
            <GridColumn>
              <Box className={styles.emptyBox} />
            </GridColumn>
          </Hidden>
          {footerItems.map((item, index) => (
            <GridColumn
              key={index}
              span={width > theme.breakpoints.sm ? undefined : '1/1'}
            >
              <Box marginRight={[8, 8, 4, 4, 8]}>
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

        <Box marginY={2} borderTopWidth="standard" borderColor="white" />

        <GridRow align="flexEnd">
          <Box marginRight={8}>
            <Inline space={2} alignY="center">
              <img
                src="https://images.ctfassets.net/8k0h54kbe6bj/1J9e4awru2K5oK9ygFvIS2/d89c30a9ab9d6c65a05aa9292931566d/jafnlaunavottun_adalmerki_2020_2023_f_dokkan_grunn_1.svg"
                alt="jafnlaunavottun"
              />
              <img
                src="https://images.ctfassets.net/8k0h54kbe6bj/6HVV7ww8isVDHgiSrQjktq/a581c570fa19567bb7bc4f286304e049/dnv-gl_accredited_international_1.svg"
                alt="international-accreditation-healthcare"
              />
            </Inline>
          </Box>
        </GridRow>
      </GridContainer>
    </footer>
  )
}

export default SAkFooter
