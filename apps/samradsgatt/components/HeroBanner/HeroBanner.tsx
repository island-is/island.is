import {
  Box,
  Columns,
  Column,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
  ArrowLink,
} from '@island.is/island-ui/core'

import { HeroLogo, SchoolIllustration } from '../svg'

export const HeroBanner = () => {
  return (
    <Box style={{ height: 464 }} background="blue100">
      <GridContainer>
        <GridRow>
          <GridColumn span="12/12">
            <Columns alignY="center" space={2}>
              <Column>
                <HeroLogo />
                <Text>
                  Markmið Samráðsgáttarinnar er að auka gagnsæi og möguleika
                  almennings og hagsmunaaðila á þátttöku í stefnumótun,
                  reglusetningu og ákvarðanatöku opinberra aðila. Hér er á einum
                  stað hægt að finna öll mál ráðuneyta sem birt hafa verið til
                  samráðs við almenning. Öllum er frjálst að senda inn umsögn
                  eða ábendingu.
                </Text>
                <ArrowLink href="/um">Lesa meira</ArrowLink>
              </Column>
              <Column>
                <SchoolIllustration />
              </Column>
            </Columns>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
export default HeroBanner
