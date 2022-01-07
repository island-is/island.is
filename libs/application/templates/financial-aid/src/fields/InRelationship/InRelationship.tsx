import React from 'react'
import { Box, Input, Text } from '@island.is/island-ui/core'
import { FAFieldBaseProps } from '../../types'
import { InputController } from '@island.is/shared/form-fields'
import { useIntl } from 'react-intl'
import { inRelationship } from '../../lib/messages'

const spouseEmail = 'spouse.email'

const InRelationship = ({ field, errors }: FAFieldBaseProps) => {
  const spouseEmailError = errors?.spouse?.email
  const { formatMessage } = useIntl()

  return (
    <div>
      <Text variant="intro" marginBottom={[2, 2, 3]}>
        {inRelationship.general.intro}
      </Text>
      <Text marginBottom={2}>
        {/* <DescriptionText text={contactInfo.general.description} /> */}
        Hvað þýðir það? Þú klárar að fylla út þína umsókn um fjárhagsaðstoð hér
        og maki þinn notar sín rafrænu skilríki til að skila inn nauðsynlegum
        gögnum.
      </Text>
      <Text marginBottom={[3, 3, 4]}>
        Úrvinnsla umsóknarinnar hefst þegar öll gögn hafa borist.
      </Text>
      <Box marginBottom={[5, 5, 10]}>
        <Box marginBottom={[2, 2, 3]}>
          <InputController
            id={spouseEmail}
            name={spouseEmail}
            backgroundColor="blue"
            type="email"
            label={formatMessage(contactInfo.inputs.phoneNumberLabel)}
            error={email.error}
            defaultValue={email.defaultValue || ''}
            onChange={() => {
              clearErrors(email.clearErrors || email.id)
            }}
          />
          <Input
            label="Netfang maka"
            name="emailSpouse"
            data-testid="emailSpouse"
            id={field.id}
            error={spouseEmailError}
            placeholder="Sláðu inn netfang maka"
            backgroundColor="blue"
            // hasError={hasError}
            // errorMessage="Athugaðu hvort netfang sé rétt slegið inn"
            type="email"
            // value={form?.spouse?.email}
            // onChange={(event) => {
            //   removeError()
            //   updateForm({
            //     ...form,
            //     spouse: {
            //       ...form.spouse,
            //       email: event.target.value,
            //     },
            //   })
            // }}
          />
        </Box>
        {/* <Checkbox
          name={'accept'}
          backgroundColor="blue"
          label="Ég skil að maki minn þarf líka að skila inn umsókn áður en úrvinnsla hefst"
          large
          checked={acceptData}
          onChange={(event) => {
            setAcceptData(event.target.checked)
            setHasError(false)
          }}
          hasError={hasError}
          errorMessage={'Þú þarft að samþykkja'}
        /> */}
      </Box>
    </div>
  )
}

export default InRelationship
