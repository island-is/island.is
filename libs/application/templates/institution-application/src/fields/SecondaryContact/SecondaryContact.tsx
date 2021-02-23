import React, { FC, useState, useMemo } from 'react'
import { FieldBaseProps, getValueViaPath } from '@island.is/application/core'
import { Box, Text, Stack, Input, Checkbox } from '@island.is/island-ui/core'
import {useFormContext } from 'react-hook-form'
import { CheckboxController } from '@island.is/shared/form-fields'
import { Button } from 'libs/island-ui/core/src/lib/ButtonDeprecated/Button'
import { YES, NO } from '../../constants'

const SecondaryContact: FC<FieldBaseProps> = ({ application, field, error }) => {
  const { register, errors, setValue, getValues, unregister } = useFormContext()
  const { id } = field
  const isEnabled = getValues('hasSecondaryContact') === YES
 
  console.log(getValues(`${id}.hasSecondaryContact`))
  
  const enableSecondaryContact = () => {
    setValue('hasSecondaryContact', YES)
  }

  const disableSecondaryContact = () => {
    // unregister([`${id}.name`, `${id}.phoneNumber`, `${id}.email`])
    setValue('hasSecondaryContact', NO)
    setValue(`${id}.name`, undefined)
    setValue(`${id}.phoneNumber`, undefined)
    setValue(`${id}.email`, undefined)
  }
  console.log('peniz-error',error);
  console.log('peniz-errors',errors);
  console.log('peniz-values',getValues());
  console.log('rendering')
  return <>
  {isEnabled ? 
      <Box marginTop={6}>
        <Stack space={3}>
          <Box marginBottom={2}>
            <Button onClick={disableSecondaryContact} icon="close"></Button>
            <Text variant="h4">Upplysingar tengiliðs 2</Text>
          </Box>
          <Input
            type="text"
            name={`${id}.name`}
            id={`${id}.name`}
            label="Nafn"
            backgroundColor="blue"
            ref={register}
            errorMessage={errors[id]?.name}
          />
          <Input
            type="tel"
            name={`${id}.phoneNumber`}
            id={`${id}.phoneNumber`}
            label="Simanumer"
            backgroundColor="blue"
            ref={register}
            errorMessage={errors[id]?.phoneNumber}
          />
          <Input
            type="email"
            name={`${id}.email`}
            id={`${id}.email`}
            label="Netfang"
            backgroundColor="blue"
            ref={register}
            errorMessage={errors[id]?.email}
          />
        </Stack>
      </Box> : 
        <Button icon="plus" onClick={enableSecondaryContact}>Bæta við tengilið</Button>}
        </>
      
  
}

export default SecondaryContact
