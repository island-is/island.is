import {
  ArrowLink,
  Box,
  Column,
  Columns,
  Divider,
  GridContainer,
  LinkV2,
  Logo,
  Stack,
  Text,
} from '@island.is/island-ui/core'
import { SGLogo } from '../svg/index'

import * as styles from './Footer.css'

const FooterLink = ({ href = '#', children }) => {
  return (
    <Column>
      <LinkV2 href={href} color="blue600" underline="small">
        {children}
      </LinkV2>
    </Column>
  )
}

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerColor}>
        <GridContainer>
          <Box paddingY={6}>
            <Columns collapseBelow="lg" space={6} alignY="center">
              <Column width="3/12">
                <SGLogo />
              </Column>
              <Column width="1/12">
                <div className={styles.verticalLine}>
                  <Divider />
                </div>
              </Column>
              <Column width="3/12">
                <Logo width={231} />
              </Column>
              <Column width="1/12">
                <div className={styles.verticalLine}>
                  <Divider />
                </div>
              </Column>
              <Column width="4/12">
                <Box display="flex" flexDirection="column">
                  <Box>
                    <Text variant="small">
                      Hér er á einum stað hægt að finna öll mál ráðuneyta sem
                      birt hafa verið til samráðs við almenning. Öllum er
                      frjálst að senda inn umsögn eða ábendingu.
                    </Text>
                  </Box>
                  <Box
                    paddingTop={1}
                    display="flex"
                    flexDirection="row"
                    justifyContent="spaceBetween"
                  >
                    <ArrowLink href="#">Lesa meira</ArrowLink>
                    <ArrowLink href="#">Hafa samband við ritstjórn</ArrowLink>
                  </Box>
                </Box>
              </Column>
            </Columns>
          </Box>
        </GridContainer>
      </div>
      <div className={styles.footerTransparent}>
        <GridContainer>
          <Box paddingY={6}>
            <Stack space={2}>
              <Columns space={2} collapseBelow={'lg'} alignY="center">
                <Column>
                  <Text variant="eyebrow" color="blue400">
                    Aðrir opinberir vefir
                  </Text>
                </Column>
              </Columns>
              <Columns space={2} collapseBelow={'lg'} alignY="center">
                <FooterLink>Heilsuvera</FooterLink>
                <FooterLink>Mannanöfn</FooterLink>
                <FooterLink>Opinber nýsköpun</FooterLink>
                <FooterLink>Opnir reikningar ríkisins</FooterLink>
              </Columns>
              <Columns space={2} collapseBelow={'lg'} alignY="center">
                <FooterLink>Samráðsgátt</FooterLink>
                <FooterLink>Undirskriftarlistar</FooterLink>
                <FooterLink>Opin gögn</FooterLink>
                <FooterLink>Tekjusagan</FooterLink>
              </Columns>
            </Stack>
          </Box>
        </GridContainer>
      </div>
    </footer>
  )
}

export default Footer
