import React, { useState } from 'react'
import { Box, Input, Select, Text, Option } from '@island.is/island-ui/core'
import { ActionModal } from '@island.is/financial-aid-web/veita/src/components'
import { useMutation } from '@apollo/client'
import { isEmailValid, StaffRole } from '@island.is/financial-aid/shared/lib'

import { serviceCenters } from '@island.is/financial-aid/shared/data'
import { MunicipalityMutation } from '@island.is/financial-aid-web/veita/graphql'
import { useStaff } from '@island.is/financial-aid-web/veita/src/utils/useStaff'

interface Props {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  activeMunicipalitiesCodes?: number[]
  onMunicipalityCreated: () => void
  allAdmins?: [
    {
      id: string
      name: string
      municipalityIds: string[]
    },
  ]
}
interface newMunicipalityModalState {
  serviceCenter: Option
  selectedAdmin: Option
  adminNationalId: string
  adminName: string
  adminEmail: string
  hasError: boolean
  hasSubmitError: boolean
}

const NewMunicipalityModal = ({
  isVisible,
  setIsVisible,
  activeMunicipalitiesCodes,
  onMunicipalityCreated,
  allAdmins,
}: Props) => {
  const selectServiceCenter = serviceCenters
    .filter(
      (el) =>
        el.number !== 0 && !activeMunicipalitiesCodes?.includes(el.number),
    )
    .map((el) => {
      return { label: el.name, value: el.number.toString() }
    })

  const [createMunicipality] = useMutation(MunicipalityMutation)
  const { updateInfo } = useStaff()

  const [state, setState] = useState<newMunicipalityModalState>({
    serviceCenter: { label: '', value: '' },
    selectedAdmin: { label: '', value: '' },
    adminNationalId: '',
    adminName: '',
    adminEmail: '',
    hasError: false,
    hasSubmitError: false,
  })

  const [errorMessage, setErrorMessage] = useState<string>()

  const areRequiredFieldsFilledForNewAdmin =
    !state.adminEmail ||
    !state.adminName ||
    !state.adminNationalId ||
    !isEmailValid(state.adminEmail) ||
    state.adminNationalId.length !== 10

  const areRequiredFieldsFilledForUpdateAdmin =
    !state.selectedAdmin.label || !state.selectedAdmin.value

  const areRequiredFieldsFilledForServiceCenter =
    !state.serviceCenter.label || !state.serviceCenter.value

  const submit = async () => {
    if (
      areRequiredFieldsFilledForServiceCenter ||
      (areRequiredFieldsFilledForUpdateAdmin &&
        areRequiredFieldsFilledForNewAdmin)
    ) {
      setState({ ...state, hasError: true })
      return
    }
    console.log(
      'ferdu hinad?',
      areRequiredFieldsFilledForNewAdmin ? 'admin' : 'bla',
    )
    try {
      return await createMunicipality({
        variables: {
          input: {
            name: state.serviceCenter.label,
            municipalityId: state.serviceCenter.value,
            admin: areRequiredFieldsFilledForNewAdmin
              ? undefined
              : {
                  name: state.adminName,
                  email: state.adminEmail,
                  nationalId: state.adminNationalId,
                  roles: [StaffRole.ADMIN],
                },
          },
        },
      }).then(() => {
        if (areRequiredFieldsFilledForNewAdmin) {
          // await updateInfo(
          //   state.selectedAdmin.value,
          //   undefined,
          //   undefined,
          //   undefined,
          //   undefined,
          //   undefined,
          //   undefined,
          //   selected?.municipalityIds && newMuni
          //     ? [...selected?.municipalityIds, newMuni]
          //     : undefined,
          // )
          console.log('veisla')
          return
        }

        // onMunicipalityCreated()
      })
    } catch (error) {
      if (error.graphQLErrors[0]?.extensions?.response?.status === 400) {
        setErrorMessage(
          'Mistókst að búa til stjórnanda, mögulega er kennitala í notkun',
        )
      } else {
        setErrorMessage('Eitthvað fór úrskeiðis, vinsamlega reynið aftur síðar')
      }

      setState({ ...state, hasSubmitError: true })
    }
  }

  return (
    <ActionModal
      isVisible={isVisible}
      setIsVisible={setIsVisible}
      header={'Nýtt sveitarfélag'}
      hasError={state.hasSubmitError}
      errorMessage={errorMessage}
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
          hasError={state.hasError && areRequiredFieldsFilledForServiceCenter}
          errorMessage="Þú þarft að velja sveitarfélag"
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
      <Text marginBottom={2} variant="small">
        Þú getur valið núverandi stjórnanda eða bætt við nýjum. <br />
        Stjórnandi fær sendan tölvupóst með hlekk til að skrá sig inn með
        rafrænum skilríkjum.
      </Text>

      {allAdmins && (
        <Box marginBottom={3}>
          <Select
            label="Leita að stjórnanda"
            name="selectAdmin"
            noOptionsMessage="Enginn valmöguleiki"
            options={allAdmins.map((el) => {
              return { label: el.name, value: el.id }
            })}
            placeholder="Veldu tegund"
            hasError={state.hasError && areRequiredFieldsFilledForUpdateAdmin}
            errorMessage="Þú þarft að velja stjórnanda"
            value={state.selectedAdmin}
            onChange={(option) => {
              setState({
                ...state,
                selectedAdmin: option as Option,
                hasError: false,
              })
            }}
          />
        </Box>
      )}

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
