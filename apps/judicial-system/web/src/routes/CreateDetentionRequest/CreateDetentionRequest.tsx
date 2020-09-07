import React, { useRef, useState } from 'react'

import { Logo } from '@island.is/judicial-system-web/src/shared-components/Logo/Logo'
import {
  Typography,
  GridContainer,
  GridRow,
  GridColumn,
  Input,
  Box,
  Select,
  Option,
  Button,
} from '@island.is/island-ui/core'
import { WorkingCase } from '../../types'
import * as api from '../../api'

export const CreateDetentionRequest: React.FC = () => {
  const [workingCase, setWorkingCase] = useState<WorkingCase>({
    id: '',
    case: {
      policeCaseNumber: '',
      suspectNationalId: '',
      suspectName: '',
      suspectAddress: '',
    },
  })
  const [, setAutoSaveSucceded] = useState<boolean>(true)
  const [isRequiredFieldValid, setIsRequiredFieldValid] = useState<boolean>(
    true,
  )

  const policeCaseNumberRef = useRef<HTMLInputElement>()
  const suspectNationalIdRef = useRef<HTMLInputElement>()

  const createCaseIfPossible = async () => {
    setIsRequiredFieldValid(policeCaseNumberRef.current.value !== '')

    const isPossibleToSave =
      workingCase.id === '' &&
      policeCaseNumberRef.current.value !== '' &&
      suspectNationalIdRef.current.value !== ''

    if (isPossibleToSave) {
      const caseId = await api.createCase({
        policeCaseNumber: policeCaseNumberRef.current.value,
        suspectNationalId: suspectNationalIdRef.current.value,
      })

      setWorkingCase({ id: caseId, case: workingCase.case })
    }
  }

  const autoSave = async (caseField: string, caseFieldValue: string) => {
    // Only save if the field has changes and the case exists
    if (
      workingCase.case[caseField] !== caseFieldValue &&
      workingCase.id !== ''
    ) {
      // Copy the working case
      const copyOfWorkingCase = Object.assign({}, workingCase)

      // Save the case
      const response = await api.saveCase(
        workingCase.id,
        caseField,
        caseFieldValue,
      )

      if (response === 200) {
        // Assign new value to the field the user is changing
        copyOfWorkingCase.case[caseField] = caseFieldValue

        // Update the working case
        setWorkingCase(copyOfWorkingCase)
      } else {
        setAutoSaveSucceded(false)

        // TODO: Do something when autosave fails
      }
    }
  }

  return (
    <Box marginTop={7}>
      <GridContainer>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Logo />
          </GridColumn>
          <GridColumn span={'8/12'} offset={'1/12'}>
            <Typography as="h1">Krafa um gæsluvarðhald</Typography>
          </GridColumn>
        </GridRow>
        <GridRow>
          <GridColumn span={'3/12'}>
            <Typography>Hliðarstika</Typography>
          </GridColumn>
          <GridColumn span={'7/12'} offset={'1/12'}>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  LÖKE málsnúmer
                </Typography>
              </Box>
              <Input
                autoFocus
                required
                name="policeCaseNumber"
                label="Slá inn LÖKE málsnúmer"
                ref={policeCaseNumberRef}
                errorMessage="Reitur má ekki vera tómur"
                hasError={!isRequiredFieldValid}
                onBlur={() => createCaseIfPossible()}
                onFocus={() => setIsRequiredFieldValid(true)}
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
                  onBlur={(evt) => autoSave('suspectName', evt.target.value)}
                />
              </Box>
              <Box marginBottom={3}>
                <Input name="suspectAddress" label="Lögheimili/dvalarstaður" />
              </Box>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Dómstóll
                </Typography>
              </Box>
              <Select
                name="court"
                label="Veldu dómstól"
                defaultValue={{
                  label: 'Héraðsdómur Reykjavíkur',
                  value: 0,
                }}
                options={[
                  {
                    label: 'Héraðsdómur Reykjavíkur',
                    value: 0,
                  },
                  {
                    label: 'Héraðsdómur Vesturlands',
                    value: 1,
                  },
                  {
                    label: 'Héraðsdómur Vestfjarða',
                    value: 2,
                  },
                  {
                    label: 'Héraðsdómur Norðurlands vestra',
                    value: 3,
                  },
                  {
                    label: 'Héraðsdómur Norðurlands eystra',
                    value: 4,
                  },
                  {
                    label: 'Héraðsdómur Austurlands',
                    value: 5,
                  },
                  {
                    label: 'Héraðsdómur Reykjaness',
                    value: 6,
                  },
                ]}
                onChange={({ label }: Option) => {
                  autoSave('court', label)
                }}
              />
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Tími handtöku
                </Typography>
              </Box>
            </Box>
            <Box component="section" marginBottom={7}>
              <Box marginBottom={2}>
                <Typography as="h3" variant="h3">
                  Ósk um fyrirtökudag og tíma
                </Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="spaceBetween">
              <Button variant="ghost" href="/">
                Til baka
              </Button>
              <Button icon="arrowRight">Halda áfram</Button>
            </Box>
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}

export default CreateDetentionRequest
