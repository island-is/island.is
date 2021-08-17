import React, { useEffect } from 'react'
import { Stack, Box, Input, Button } from '@island.is/island-ui/core'
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
} from 'react-hook-form'
import { ApplicationData } from './../../entities/application-data'
import ValidationUtils from './../../utils/validation.utils'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: ApplicationData
}

const ChildrenUnderCare: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const hookFormData = useForm<ApplicationData>()

  const submit = () => {
    const application = new ApplicationData()
    application.initialInfo = hookFormData.getValues().initialInfo

    onSubmit(hookFormData.getValues())
  }

  useEffect(() => {
    console.log(defaultValues)
  }, [defaultValues])

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: hookFormData.control,
      name: 'initialInfo.childrenUnderCare', // unique name for your Field Array
      // keyName: 'nationalId', //, default to "id", you can change the key name
    },
  )

  return (
    <Stack space={3}>
      <FormProvider {...hookFormData}>
        <Box
          component="form"
          display="flex"
          flexDirection="column"
          justifyContent="spaceBetween"
          height="full"
        >
          <Stack space={2}>
            {fields.map((field, index) => (
              <div
                key={field.id}
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  flexDirection: 'row',
                  gap: 16,
                  paddingTop: (index != 0 && 8) || 0,
                }}
              >
                <Controller
                  name={`initialInfo.childrenUnderCare.${index}.name`}
                  defaultValue={field.name}
                  render={({ onChange, value }) => (
                    <div style={{ minWidth: '320px', flexGrow: 1 }}>
                      <Input
                        name={`initialInfo.childrenUnderCare.${index}.name`}
                        placeholder="Nafn"
                        value={value}
                        onChange={onChange}
                        label="Nafn"
                        // errorMessage="Nafn getur ekki innihaldið tölustafi"
                        // hasError={!ValidationUtils.validatenam(value)}
                      />
                    </div>
                  )}
                />
                <Controller
                  name={`initialInfo.childrenUnderCare.${index}.nationalId`}
                  defaultValue={field.nationalId}
                  render={({ onChange, value }) => (
                    <div style={{ minWidth: '320px', flexGrow: 1 }}>
                      <Input
                        name={`initialInfo.childrenUnderCare.${index}.nationalId`}
                        placeholder="Kennitala"
                        value={value}
                        onChange={onChange}
                        label="Kennitala"
                        errorMessage="Kennitala er röng"
                        hasError={!ValidationUtils.validateNationalId(value)}
                      />
                    </div>
                  )}
                />
              </div>
            ))}
            <Button
              circle
              colorScheme="default"
              icon="add"
              iconType="filled"
              onClick={() => {
                append({ name: '', nationalId: '', id: fields.length })
              }}
              preTextIconType="filled"
              size="default"
              title="Add Child"
              type="button"
              variant="primary"
            />
          </Stack>
        </Box>
        <Box paddingTop={2}>
          <Button onClick={submit}>Næsta skref</Button>
        </Box>
      </FormProvider>
    </Stack>
  )
}

export default ChildrenUnderCare
