import React, { useContext } from 'react'
import { Input, Checkbox, Box } from '@island.is/island-ui/core'

import {
  focusOnNextInput,
  isEmailValid,
  sanitizeNationalId,
} from '@island.is/financial-aid/shared/lib'
import { FormContext } from '../FormProvider/FormProvider'

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
                nationalId: sanitizeNationalId(event.target.value),
              },
            })
            removeError()

            focusOnNextInput(event, 'email')
          }}
        />
      </Box>

      <Box marginBottom={[2, 2, 3]}>
        <Input
          label="Netfang maka"
          name="emailSpouse"
          id="email"
          placeholder="Sláðu inn netfang maka"
          backgroundColor="blue"
          hasError={
            (hasError && !form?.spouse?.email) ||
            (hasError && !isEmailValid(form?.spouse?.email))
          }
          errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
          type="email"
          value={form?.spouse?.email}
          onChange={(event) => {
            removeError()
            updateForm({
              ...form,
              spouse: {
                ...form.spouse,
                email: event.target.value,
              },
            })
          }}
        />
      </Box>

      <Box>
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
