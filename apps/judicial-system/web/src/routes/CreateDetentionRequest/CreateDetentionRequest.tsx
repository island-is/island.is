import React from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
} from '@island.is/island-ui/core'

export const CreateDetentionRequest: React.FC = () => {
  return (
    <GridContainer>
      <GridRow>
        <GridColumn span={3}>
          <Logo />
        </GridColumn>
        <GridColumn span={8} offset={1}>
          <Typography as="h1">Krafa um gæsluvarðhald</Typography>
        </GridColumn>
      </GridRow>
      <GridRow>
        <GridColumn span={3}>
          <Typography>Hliðarstika</Typography>
        </GridColumn>
        <GridColumn span={7} offset={1}>
          <Input
            autoFocus
            name="policeCaseNumber"
            label="Slá inn LÖKE málsnúmer"
          />
          <Input name="nationalId" label="Kennitala" />
          <Input name="suspectName" label="Fullt nafn kærða" />
          <Input name="suspectAddress" label="Lögheimili/dvalarstaður" />
        </GridColumn>
      </GridRow>
    </GridContainer>
  )
}

export default CreateDetentionRequest
