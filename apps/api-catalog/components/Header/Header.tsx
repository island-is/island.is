import React, { useState } from 'react'
import { Box, Button, Column, Columns, GridColumn, GridContainer, GridRow, Link } from '@island.is/island-ui/core'

import { Header as IslandUIHeader } from '@island.is/island-ui/core'
import { SideMenu } from '..'

function Header() {

  const [sideMenuOpen, setSideMenuOpen] = useState(false)
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span="12/12" paddingTop={4} paddingBottom={4}>
          <Columns alignY="center" space={2}>
            <Column width="content">
              <IslandUIHeader
                logoRender={(logo) => (
                  <Link href="/">
                    {logo}
                  </Link>
                )}
              />
            </Column>
            <Column>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="flexEnd"
                width="full"
              >

                <Button
                  variant="menu"
                  onClick={() => setSideMenuOpen(!sideMenuOpen)}
                  icon="burger"
                >
                  Valmynd
              </Button>



              </Box>
            </Column>
          </Columns>
        </GridColumn>
      </GridRow>
      <SideMenu
        isVisible={sideMenuOpen}
        title="Viskuausan"
        links={[
          { title: "Upphafsíða", url: "/"},
          { title: "API Vörulisti", url: "/services"},
          { title: "Þróunarhandbók", url: "/design-guide"},
        ]}
        handleClose={() => setSideMenuOpen(false)}
      />
    </GridContainer>
  )
}

export default Header
