import {
  ArrowLink,
  Columns,
  GridColumn,
  GridContainer,
  GridRow,
  Hidden,
  Logo,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { FooterColumn } from './components/FooterColumn'
import localization from '../../Layout.json'

import * as styles from './Footer.css'
import { LogoText } from '../../../../components'

const Footer = () => {
  const loc = localization.footer
  return (
    <footer className={styles.footer}>
      <Hidden print={true}>
        <div className={styles.footerColor}>
          <GridContainer>
            <GridRow>
              <GridColumn span="12/12" paddingTop={6} paddingBottom={6}>
                <Columns
                  alignY="center"
                  space={2}
                  collapseBelow="lg"
                  align="center"
                >
                  <FooterColumn justifyContent="flexStart">
                    <LogoText isSmall />
                  </FooterColumn>
                  <FooterColumn isDivider />
                  <FooterColumn justifyContent="center">
                    <Logo />
                  </FooterColumn>
                  <FooterColumn isDivider />
                  <FooterColumn justifyContent="flexEnd">
                    <Stack space={1}>
                      <Text variant="small">{loc.text}</Text>
                      <ArrowLink href="mailto:samradsgatt@stjornarradid.is">
                        {loc.arrowLinkText}
                      </ArrowLink>
                    </Stack>
                  </FooterColumn>
                </Columns>
              </GridColumn>
            </GridRow>
          </GridContainer>
        </div>
      </Hidden>
    </footer>
  )
}

export default Footer
