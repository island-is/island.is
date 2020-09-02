import React, { useRef } from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
  Box,
} from '@island.is/island-ui/core'
import * as api from '../../api'

export const CreateDetentionRequest: React.FC = () => {
  const policeCaseNumberRef = useRef<HTMLInputElement>()
  const suspectNationalIdRef = useRef<HTMLInputElement>()
  const suspectNameRef = useRef<HTMLInputElement>()

  const saveCaseIfPossible = async () => {
    const isPossibleToSave =
      policeCaseNumberRef.current.value !== '' &&
      suspectNationalIdRef.current.value !== '' &&
      suspectNameRef.current.value !== ''

    if (isPossibleToSave) {
      await api.saveCase({
        description: 'test', // TODO: fix this
        policeCaseNumber: policeCaseNumberRef.current.value,
        suspectNationalId: suspectNationalIdRef.current.value,
        suspectName: suspectNameRef.current.value,
      })
    }
  }

  return (
    <Box marginTop={7}>
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
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  LÖKE málsnúmer
                </Typography>
              </Box>
              <Input
                autoFocus
                name="policeCaseNumber"
                label="Slá inn LÖKE málsnúmer"
                ref={policeCaseNumberRef}
                onBlur={() => saveCaseIfPossible()}
              />
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Ákærði
                </Typography>
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="nationalId"
                  label="Kennitala"
                  ref={suspectNationalIdRef}
                  onBlur={() => saveCaseIfPossible()}
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="suspectName"
                  label="Fullt nafn kærða"
                  ref={suspectNameRef}
                  onBlur={() => saveCaseIfPossible()}
                />
              </Box>
              <Box marginBottom={3}>
                <Input name="suspectAddress" label="Lögheimili/dvalarstaður" />
              </Box>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default CreateDetentionRequest
