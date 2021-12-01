import React from 'react'
import { FooterItem } from '@island.is/web/graphql/schema'
import {
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
  Text,
} from '@island.is/island-ui/core'
import * as styles from './SjukratryggingarFooter.css'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import { BLOCKS } from '@contentful/rich-text-types'

interface FooterProps {
  title: string
  logo?: string
  footerItems: Array<FooterItem>
}

export const SjukratryggingarFooter: React.FC<FooterProps> = ({
  title,
  logo,
  footerItems,
}) => {
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <Box className={styles.footerBg} color="white" paddingTop={5}>
        <GridContainer>
          <Box paddingTop={[2, 2, 0]} paddingBottom={[0, 0, 4]}>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              paddingBottom={4}
              marginBottom={4}
              borderColor="dark400"
              borderBottomWidth="standard"
            >
              <Box marginRight={4}>
                <img src='/assets/sjukratryggingar_logo.png' alt="" className={styles.logoStyle} />
              </Box>
            </Box>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box>
                  <Box marginBottom={2}>
                    <Text color='dark400' variant='h4' paddingBottom={2}>Heilbrigðisþjónusta</Text>
                    <Text color='dark400' variant='h4' paddingBottom={2}>Lyf og hjálpartæki</Text>
                    <Text color='dark400' variant='h4' paddingBottom={2}>Heilbrigðisstarfsfólk</Text>
                    <Text color='dark400' variant='h4' paddingBottom={2}>Slysatryggingar og réttindi</Text>
                    <Text color='dark400' variant='h4' paddingBottom={2}>Réttindi milli landa</Text>
                    <Text color='dark400' variant='h4'>Um okkur</Text>
                  </Box>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box>
                  <Box marginBottom={2}>
                    <Text color='dark400' variant='h4'>Algengar fyrirspurnir</Text>
                    <Text color='dark400' marginY={1}>Evrópska sjúkratryggingakortið</Text>
                    <Text color='dark400' marginY={1}>Greiðsluþáttaka</Text>
                    <Text color='dark400' marginY={1}>Heilsugæsla</Text>
                    <Text color='dark400' marginY={1}>Ferðakostnaður</Text>
                    <Text color='dark400' marginY={1}>Þjónusta í heimahúsum</Text>
                    <Text color='dark400' marginY={1}>Sjúkrahótel</Text>
                  </Box>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box>
                  <Box marginBottom={2}>
                    <Text color='dark400' variant='h5'>Sjúkratryggingar Íslands</Text>
                    <Text color='dark400' marginY={1}>kt. 480408-0550</Text>
                    <Text color='dark400' marginY={1}>Vínlandsleið 16, 113 Reykjavík</Text>
                  </Box>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box>
                  <Box marginBottom={2}>
                    <Text color='dark400' variant='h5'>Þjónustuver og hjálpartækjamiðstöð</Text>
                    <Text color='dark400' marginY={1}>Mán - fim: 10:00 - 15:00</Text>
                    <Text color='dark400' marginY={1}>Fös: 08:00 - 13:00</Text>
                    <Text color='dark400' marginTop={3} variant='h5'>Sími: 515 0000</Text>
                    <Text color='dark400' marginY={1} variant='h5'>Tölvupóstur: sjukra@sjukra.is</Text>
                    <Text color='dark400' marginTop={3} variant='h5'>Símatími iðjuþjálfara</Text>
                    <Text color='dark400' marginY={1}>Mán - fös: 10:00 - 12:00</Text>
                  </Box>
                </Box>
              </GridColumn>
            </GridRow>
          </Box>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            paddingTop={4}
            borderColor="dark400"
            borderTopWidth="standard"
          >
            <GridContainer>
            <GridRow>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box marginBottom={5}>
                  <Box marginBottom={2}>
                    <img src="/assets/sjukratryggingar_norraent_samstarf.png"/>
                  </Box>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box marginBottom={5}>
                  <Box marginBottom={2}>
                    <img src="/assets/sjukratryggingar_heilbrigdisraduneytid.png"/>
                  </Box>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box marginBottom={5}>
                  <Box marginBottom={2}>
                    <Text color='dark400' variant='small'  marginY={1}>Sjá staðsetningu á korti</Text>
                    <Text color='dark400' variant='small'  marginY={1}>Sjúkratryggingar á facebook</Text>
                  </Box>
                </Box>
              </GridColumn>
              <GridColumn span={['12/12', '12/12', '3/12']}>
                <Box marginBottom={5}>
                  <Box marginBottom={2}>
                    <Text color='dark400' variant='small'  marginY={1}>Þjónusta á landsbyggðinni</Text>
                    <Text color='dark400' variant='small' marginY={1}>Viðgerðarþjónusta á höfuðborgarsvæðinu</Text>
                  </Box>
                </Box>
              </GridColumn>
            </GridRow>
            </GridContainer>
          </Box>
        </GridContainer>
      </Box>
    </footer>
  )
}
