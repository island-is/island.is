import React, { useContext } from 'react'
import { Input, Checkbox, Box } from '@island.is/island-ui/core'

import {
  focusOnNextInput,
  isEmailValid,
  sanitizeOnlyNumbers,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '../FormProvider/FormProvider'
import SpouseEmailInput from '../SpouseEmailInput/SpouseEmailInput'

interface Props {
  hasError: boolean
  acceptData: boolean
  setAcceptData: (event: React.ChangeEvent<HTMLInputElement>) => void
  removeError: () => void
}

const SpouseInfo = ({
  hasError,
  acceptData,
  setAcceptData,
  removeError,
}: Props) => {
  const { form, updateForm } = useContext(FormContext)

  return (
    <>
      <Box marginBottom={[2, 2, 3]} marginTop={[1, 1, 0]}>
        <Input
          label="Kennitala maka"
          name="nationalIdSpouse"
          data-testid="nationalIdSpouse"
          placeholder="Sláðu inn kennitölu maka"
          backgroundColor="blue"
          hasError={
            (hasError && !form?.spouse?.nationalId) ||
            (hasError && form?.spouse?.nationalId?.length !== 10)
          }
          errorMessage="Athugaðu hvort kennitalan sé rétt slegin inn, gild kennitala er 10 stafir"
          value={form?.spouse?.nationalId}
          maxLength={10}
          onChange={(event) => {
            updateForm({
              ...form,
              spouse: {
                ...form.spouse,
                nationalId: sanitizeOnlyNumbers(event.target.value),
              },
            })
            removeError()

            focusOnNextInput(event, 'email')
          }}
        />
      </Box>

      <SpouseEmailInput
        hasError={
          hasError &&
          Boolean(form.spouse?.email && isEmailValid(form.spouse.email)) ===
            false
        }
        removeError={removeError}
      />

      <Box data-testid="acceptSpouseTerms">
        <Checkbox
          name={'accept'}
          id="accept"
          backgroundColor="blue"
          label="Ég skil að maki minn þarf líka að skila inn umsókn áður en úrvinnsla hefst"
          large
          checked={acceptData}
          onChange={setAcceptData}
          hasError={hasError && !acceptData}
          errorMessage={'Verður að samþykkja'}
        />
      </Box>
    </>
  )
}

export default SpouseInfo
