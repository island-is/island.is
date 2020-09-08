import React, { FC } from 'react'
import { ServicePortalModuleComponent } from '@island.is/service-portal/core'
import {
  Stack,
  Typography,
  Button,
  Columns,
  Column,
  Box,
} from '@island.is/island-ui/core'

const DelegationGreeting: ServicePortalModuleComponent = ({ userInfo }) => {
  return (
    <Box marginBottom={8}>
      <Columns collapseBelow="sm">
        <Column width="7/12">
          <Stack space={2}>
            <Typography variant="h3">Umboðskerfi</Typography>
            <Typography variant="p">
              Sæl/l {userInfo.user.profile.name}, í umboðskerfinu getur þú veitt
              aðilum umboð fyrir sjálfan þig eða fyrirtæki/stofnun sem þú hefur
              aðgang að.
            </Typography>
          </Stack>
          <Box marginTop={4}>
            <a
              href="https://innskraning.island.is/addonbehalf.aspx"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button icon="external">Fara í umboðskerfi</Button>
            </a>
          </Box>
        </Column>
      </Columns>
    </Box>
  )
}

export default DelegationGreeting
