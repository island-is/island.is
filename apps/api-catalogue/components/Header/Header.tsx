import React, { useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Link,
} from '@island.is/island-ui/core'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'
import { SideMenu } from '..'

function Header() {
  const [sideMenuOpen, setSideMenuOpen] = useState(false)

  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="11/12" paddingTop={4} paddingBottom={4}>
          <IslandUIHeader logoRender={(logo) => <Link href="/">{logo}</Link>} />
        </GridColumn>
        <GridColumn span="1/12" paddingTop={4} paddingBottom={4}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="flexEnd"
            width="full"
            height="full"
          >
            <Button
              variant="utility"
              onClick={() => setSideMenuOpen(true)}
              icon="menu"
              size="small"
            >
              Valmynd
            </Button>
          </Box>
        </GridColumn>
      </GridRow>
      <SideMenu
        isVisible={sideMenuOpen}
        handleClose={() => setSideMenuOpen(false)}
        title="Viskuausan"
        links={[
          { title: 'Upphafssíða', url: '/' },
          { title: 'API Vörulisti', url: '/services' },
          { title: 'Þróunarhandbók', url: '/design-guide' },
          { title: 'Island.is', url: 'https://island.is' },
        ]}
      />
    </GridContainer>
  )
}

export default Header
