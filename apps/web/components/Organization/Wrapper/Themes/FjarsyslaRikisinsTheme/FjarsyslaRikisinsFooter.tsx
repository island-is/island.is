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

import * as styles from './FjarsyslaRikisinsFooter.css'

interface FjarsyslaRikisinsFooterProps {
  footerItems: FooterItem[]
  logo?: string
}

const FjarsyslaRikisinsFooter = ({
  footerItems,
  logo,
}: FjarsyslaRikisinsFooterProps) => {
  return (
    <footer className={styles.container} aria-labelledby="fjarsyslan-footer">
      <GridContainer>
        <Box className={styles.firstRow}>
          {!!logo && <img width={80} height={80} src={logo} alt="" />}
          <img
            src="https://images.ctfassets.net/8k0h54kbe6bj/2SjyMU3OtnoSqJg4fan1Tc/3d94afd4232f59f056e9f803e07d1433/Fja__rsy__slan.svg"
            alt="Fjársýslan"
          />
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
