import {
  Box,
  Divider,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/api/schema'
import { Image, Maybe } from '@island.is/web/graphql/schema'
import { useIsMobile, renderFooterItems } from './helpers'
import * as styles from './RettindagaeslaFatladsFolksFooter.css'

interface Props {
  title: string
  logo: Maybe<Image> | undefined
  footerItems: FooterItem[]
}

const RettindagaeslaFatladsFolksFooter = ({
  title,
  logo,
  footerItems,
}: Props) => {
  const isMobile = useIsMobile()
  return (
    <>
      <Divider />
      <footer className={styles.container} aria-labelledby="rgf-footer">
        <GridContainer>
          <GridRow>
            <Box display="flex" alignItems="center" columnGap={4}>
              <img width={80} alt="skjaldarmerki" src={logo?.url} />
              <Text variant="h3">{title}</Text>
            </Box>
          </GridRow>
          {isMobile ? (
            <Box display="flex" padding={0} paddingTop={2}>
              <GridRow>
                <GridColumn>
                  {renderFooterItems({
                    span: '1/1',
                    footerItems: footerItems,
                  })}
                </GridColumn>
              </GridRow>
            </Box>
          ) : (
            <GridRow align="flexStart">
              <img
                style={{ visibility: 'hidden', marginRight: 'inherit' }}
                width={80}
                alt="skjaldarmerki_hidden"
                src={logo?.url}
              />
              <Box marginLeft={4} />
              {renderFooterItems({ span: '3/12', footerItems: footerItems })}
            </GridRow>
          )}
        </GridContainer>
      </footer>
      <Divider />
    </>
  )
}

export default RettindagaeslaFatladsFolksFooter
