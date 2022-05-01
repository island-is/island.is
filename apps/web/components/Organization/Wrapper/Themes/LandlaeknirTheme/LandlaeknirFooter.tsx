import {
  ArrowLink,
  Box,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { FooterItem } from '@island.is/web/graphql/schema'
// TODO: get the facebook logo from somewhere else
import { Icon } from 'libs/island-ui/core/src/lib/Icon/Icon'
import React from 'react'

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
              alt="landlaeknir-logo"
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
                <ArrowLink color="blue400">
                  Vertu vinur okkar á Facebook
                </ArrowLink>
                <Icon height="24" width="24" type="facebook" />
              </GridRow>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink color="blue400">
                  Vertu vinur okkar á Facebook
                </ArrowLink>
                <Icon height="24" width="24" type="facebook" />
              </GridRow>
            </GridColumn>
            <GridColumn span={['12/12', '12/12', '3/12']}>
              <GridRow alignItems="center">
                <ArrowLink color="blue400">
                  Vertu vinur okkar á Facebook
                </ArrowLink>
                <Icon height="24" width="24" type="facebook" />
              </GridRow>
            </GridColumn>
          </GridRow>
        </GridColumn>
      </GridContainer>
    </footer>
  )
}

export default LandLaeknirFooter
