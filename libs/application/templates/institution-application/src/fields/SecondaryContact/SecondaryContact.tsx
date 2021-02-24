import React, { FC } from 'react'
import { FieldBaseProps } from '@island.is/application/core'
import { Box, Text, Stack, Input, Icon, Button } from '@island.is/island-ui/core'
import {useFormContext } from 'react-hook-form'
import { YES, NO } from '../../constants'
import * as styles from './SecondaryContact.treat'

const SecondaryContact: FC<FieldBaseProps> = ({ field, error }) => {
  const { register, errors, setValue, getValues } = useFormContext()
  const { id } = field
  const isEnabled = getValues('hasSecondaryContact') === YES
 
  console.log(getValues(`${id}.hasSecondaryContact`))
  
  const enableSecondaryContact = () => {
    setValue('hasSecondaryContact', YES)
  }

  const disableSecondaryContact = () => {
    setValue('hasSecondaryContact', NO)
    setValue(`${id}.name`, undefined)
    setValue(`${id}.phoneNumber`, undefined)
    setValue(`${id}.email`, undefined)
  }
  console.log('2ndaryContact-error',error);
  console.log('2ndaryContact-errors',errors);
  console.log('2ndaryContact-values',getValues());
  console.log('rendering')
  return <>
  {isEnabled ? 
      <Box marginTop={4}>
        <Stack space={3}>
        
          <Box marginBottom={2} display="flex" position="relative" alignItems="center">
            <Box
                className={styles.deleteIcon}
                onClick={disableSecondaryContact}
              >
                <Icon
                  color="dark200"
                  icon="removeCircle"
                  size="medium"
                  type="outline"
                />
              </Box>
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
            required
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
        <Box marginTop={4}>
          <Button icon="add" variant="ghost" size="small" onClick={enableSecondaryContact}>Bæta við tengilið</Button>
        </Box>
  }
        </>
      
  
}

export default SecondaryContact
