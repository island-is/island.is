import React, { useRef, useState } from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
  Box,
} from '@island.is/island-ui/core'
import { WorkingCase } from '../../types'
import * as api from '../../api'

export const CreateDetentionRequest: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<WorkingCase>({
    id: '',
    case: {
      description: '',
      policeCaseNumber: '',
      suspectName: '',
      suspectNationalId: '',
    },
  })

  const policeCaseNumberRef = useRef<HTMLInputElement>()
  const suspectNationalIdRef = useRef<HTMLInputElement>()
  const suspectNameRef = useRef<HTMLInputElement>()

  const createCaseIfPossible = async () => {
    const isPossibleToSave =
      policeCaseNumberRef.current.value !== '' &&
      suspectNationalIdRef.current.value !== ''

    if (isPossibleToSave) {
      const caseId = await api.createCase({
        description: 'test', // TODO: fix this
        policeCaseNumber: policeCaseNumberRef.current.value,
        suspectNationalId: suspectNationalIdRef.current.value,
        suspectName: 'test', // TODO: fix this
      })

      setWorkingCase({ id: caseId, case: workingCase.case })
    }
  }

  const autoSave = (caseField: string, caseFieldValue: string) => {
    // Only save if the field has changes
    if (workingCase.case[caseField] !== caseFieldValue) {
      // Copy the working case
      let copyOfWorkingCase = Object.assign({}, workingCase)

      // Save the case
      api.saveCase(workingCase.id, caseField, caseFieldValue)

      // Assign new value to the field the user is changing
      copyOfWorkingCase.case[caseField] = caseFieldValue

      // Update the working case
      setWorkingCase(copyOfWorkingCase)
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
                onBlur={() => createCaseIfPossible()}
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
                  onBlur={() => createCaseIfPossible()}
                />
              </Box>
              <Box marginBottom={3}>
                <Input
                  name="suspectName"
                  label="Fullt nafn kærða"
                  ref={suspectNameRef}
                  onBlur={(evt) => autoSave('suspectName', evt.target.value)}
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
