import { BLOCKS } from '@contentful/rich-text-types'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import {
  Box,
  GridContainer,
  Text,
  GridRow,
  GridColumn,
  Hidden,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
import { useNamespace } from '@island.is/web/hooks'

import * as styles from './FjarsyslaRikisinsFooter.css'

interface FjarsyslaRikisinsFooterProps {
  footerItems: FooterItem[]
  logo?: string
  namespace: Record<string, string>
}

const FjarsyslaRikisinsFooter = ({
  footerItems,
  logo,
  namespace,
}: FjarsyslaRikisinsFooterProps) => {
  const n = useNamespace(namespace)

  return (
    <footer className={styles.container} aria-labelledby="fjarsyslan-footer">
      <GridContainer>
        <Box className={styles.firstRow}>
          {!!logo && <img width={80} height={80} src={logo} alt="" />}
          <Text variant="h2" as="div">
            <span className={styles.heading}>
              {n('fjarsyslanTitle', 'Fjársýslan')}
            </span>
          </Text>
        </Box>

        <Box marginY={2} borderTopWidth="standard" borderColor="blue600" />

        <GridRow>
          <Hidden below="lg">
            <GridColumn>
              <Box className={styles.emptyBox} />
            </GridColumn>
          </Hidden>
          {footerItems.map((item, index) => (
            <GridColumn key={index}>
              <Box marginRight={8}>
                {!!item.title?.trim()?.length && (
                  <Text fontWeight="semiBold" color="blue600" marginBottom={2}>
                    {item.title}
                  </Text>
                )}
                {richText(item.content as SliceType[], {
                  renderNode: {
                    [BLOCKS.PARAGRAPH]: (_node, children) => (
                      <Text color="blue600" variant="medium" marginBottom={2}>
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

export default FjarsyslaRikisinsFooter
