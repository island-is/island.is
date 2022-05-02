import React from 'react'
import {
  ArrowLink,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'

const FACEBOOK_LOGO =
  'https://images.ctfassets.net/8k0h54kbe6bj/1hx4HeCK1OFzPIjtKkMmrL/fa769439b9221a92bfb124b598494ba4/Facebook-Logo-Dark.svg'

interface LandLaeknirFooterProps {
  footerItems: Array<FooterItem>
  phone?: string
}

export const LandLaeknirFooter = ({
  footerItems,
  phone,
}: LandLaeknirFooterProps) => {
  return (
    <footer aria-labelledby="organizationFooterTitle">
      <GridContainer>
        <GridColumn>
          <GridRow>
            <img
              src="/assets/landlaeknir_heilbrigdisraduneytid.png"
              alt="landlaeknirLogo"
            />
          </GridRow>
          <GridRow></GridRow>
          <GridRow>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <img src="/assets/jafnlaunavottun.svg" alt="jafnlaunavottun" />
                <Box>
                  <Text fontWeight="medium">Jafnlaunavottun</Text>
                  <Text fontWeight="medium">2020 - 2023</Text>
                </Box>
              </GridRow>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink
                  href="https://www.facebook.com/landlaeknir"
                  color="blue400"
                >
                  Vertu vinur okkar á Facebook
                </ArrowLink>
                <img src={FACEBOOK_LOGO} alt="facebookLogo" />
              </GridRow>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink color="blue400">
                  Vertu vinur okkar á Facebook
                </ArrowLink>
              </GridRow>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink color="blue400">
                  Vertu vinur okkar á Facebook
                </ArrowLink>
              </GridRow>
            </GridColumn>
          </GridRow>
        </GridColumn>
      </GridContainer>
    </footer>
  )
}

export default LandLaeknirFooter
