import { BLOCKS } from '@contentful/rich-text-types'
import { SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Hyphen,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { webRichText } from '@island.is/web/utils/richText'
import * as styles from './OpinberNyskopunFooter.css'

interface OpinberNyskopunFooterProps {
  footerItems: FooterItem[]
}

export const OpinberNyskopunFooter: React.FC<OpinberNyskopunFooterProps> = ({
  footerItems,
}) => {
  return (
    <footer className={styles.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['4/12', '4/12', '3/12', '2/12']}>
            <img
              width={133}
              height={71}
              src="https://images.ctfassets.net/8k0h54kbe6bj/21JLHgkyocLA8lcT0AaK4e/545f1363de7eb8160055bd39d3c72d14/rikiskaup.svg"
              alt=""
            />
          </GridColumn>
          <GridColumn
            position="relative"
            span={['8/12', '8/12', '9/12', '10/12']}
          >
            {footerItems?.[0]?.title && (
              <Text variant="h2" color="white">
                <Hyphen>{footerItems[0].title}</Hyphen>
              </Text>
            )}
            <Box marginY={2} className={styles.line} />
            <Box marginTop={4} display="flex" flexWrap="wrap">
              {footerItems.slice(1).map((item) => (
                <Box key={item.id} marginRight={8}>
                  <Text fontWeight="semiBold" color="white" marginBottom={2}>
                    {item.title}
                  </Text>
                  {webRichText(item.content as SliceType[], {
                    renderNode: {
                      [BLOCKS.PARAGRAPH]: (_node, children) => (
                        <Text color="white" variant="medium" marginBottom={2}>
                          {children}
                        </Text>
                      ),
                    },
                  })}
                </Box>
              ))}
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </footer>
  )
}
