import React, { useState } from 'react'
import { Box, Input, Select, Text, Option } from '@island.is/island-ui/core'
import { ActionModal } from '@island.is/financial-aid-web/veita/src/components'
import { useMutation } from '@apollo/client'
import { isEmailValid } from '@island.is/financial-aid/shared/lib'

import { serviceCenters } from '@island.is/financial-aid/shared/data'
import cn from 'classnames'
import { MunicipalityMutation } from '@island.is/financial-aid-web/veita/graphql'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  activeMuncipality?: number[]
}

interface newMunicipalitModalState {
  serviceCenter: Option
  adminNationalId: string
  adminName: string
  adminEmail: string
  hasError: boolean
  hasSubmitError: boolean
}

const NewMunicipalityModal = ({
  isVisible,
  setIsVisible,
  activeMuncipality,
}: Props) => {
  const selectServiceCenter = serviceCenters
    .filter((el) => el.number !== 0 && !activeMuncipality?.includes(el.number))
    .map((el) => {
      return { label: el.name, value: el.number.toString() }
    })

  const [createMunicipality] = useMutation(MunicipalityMutation)

  const [state, setState] = useState<newMunicipalitModalState>({
    serviceCenter: { label: '', value: '' },
    adminNationalId: '',
    adminName: '',
    adminEmail: '',
    hasError: false,
    hasSubmitError: false,
  })

  const areRequiredFieldsFilled =
    !state.adminEmail ||
    !state.adminName ||
    !state.adminNationalId ||
    !isEmailValid(state.adminEmail) ||
    state.adminNationalId.length !== 10

  const submit = async () => {
    if (areRequiredFieldsFilled) {
      setState({ ...state, hasError: true })
      return
    }
    try {
      return await createMunicipality({
        variables: {
          input: {
            name: state.serviceCenter.label,
            municipalityId: state.serviceCenter.value,
          },
        },
      }).then(() => {
        console.log('tókst')
        // onStaffCreated()
      })
    } catch (e) {
      setState({ ...state, hasSubmitError: true })
    }
  }

  return (
    <ActionModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      header={'Nýtt sveitarfélag'}
      hasError={state.hasSubmitError}
      errorMessage={'Eitthvað fór úrskeiðis, vinsamlega reynið aftur síðar'}
      submitButtonText={'Stofna sveitarfélag'}
      onSubmit={submit}
    >
      <Box marginBottom={3}>
        <Select
          label="Sveitarfélag"
          name="selectMunicipality"
          noOptionsMessage="Enginn valmöguleiki"
          options={selectServiceCenter}
          placeholder="Veldu tegund"
          value={state.serviceCenter}
          onChange={(option) => {
            setState({
              ...state,
              serviceCenter: option as Option,
              hasError: false,
            })
          }}
        />
      </Box>

      <Text marginBottom={2} variant="h4">
        Stjórnandi
      </Text>
      <Box marginBottom={2}>
        <Input
          label="Kennitala"
          name="adminNationalId"
          type={'number'}
          placeholder="Sláðu inn kennitölu"
          backgroundColor="blue"
          value={state.adminNationalId}
          onChange={(event) => {
            if (event.currentTarget.value.length <= 10) {
              setState({
                ...state,
                adminNationalId: event.currentTarget.value,
                hasError: false,
              })
            }
          }}
          hasError={
            state.hasError &&
            (!state.adminNationalId || state.adminNationalId.length !== 10)
          }
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          label="Fullt nafn"
          name="adminName"
          value={state.adminName}
          placeholder="Sláðu inn fullt nafn"
          backgroundColor="blue"
          onChange={(event) => {
            setState({
              ...state,
              hasError: false,
              adminName: event.currentTarget.value,
            })
          }}
          hasError={state.hasError && !state.adminName}
        />
      </Box>
      <Box marginBottom={2}>
        <Input
          label="Netfang"
          name="adminEmail"
          value={state.adminEmail}
          placeholder="Sláðu inn netfang"
          backgroundColor="blue"
          type={'email'}
          onChange={(event) => {
            setState({
              ...state,
              hasError: false,
              adminEmail: event.currentTarget.value,
            })
          }}
          hasError={
            state.hasError &&
            (!state.adminEmail || !isEmailValid(state.adminEmail))
          }
        />
      </Box>
      <Text marginBottom={3} variant="small">
        Notandi fær sendan tölvupóst með hlekk til að skrá sig inn með rafrænum
        skilríkjum.
      </Text>
    </ActionModal>
  )
}

export default NewMunicipalityModal
