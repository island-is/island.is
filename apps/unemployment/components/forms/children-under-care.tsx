import React, { useContext, useEffect } from 'react'
import { Stack, Box, Input, Button } from '@island.is/island-ui/core'
import {
  useForm,
  FormProvider,
  Controller,
  useFieldArray,
} from 'react-hook-form'
import { ApplicationData } from './../../entities/application-data'
import ValidationUtils from './../../utils/validation.utils'
import { UnemploymentStep } from '../../entities/enums/unemployment-step.enum'
import { ApplicationService } from '../../services/application.service'

interface PropTypes {
  onBack: () => void
  onSubmit: (data) => void
  defaultValues: ApplicationData
}

const ChildrenUnderCare: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
  onBack,
}: PropTypes) => {
  const hookFormData = useForm<ApplicationData>({
    defaultValues: defaultValues,
  })

  const submit = () => {
    // console.log('SAVING WITH HookFormData: ', hookFormData.getValues())
    const application = defaultValues
    application.childrenUnderCare = hookFormData.getValues().childrenUnderCare
    // console.log('SAVING WITH application: ', application)
    application.stepCompleted = UnemploymentStep.ChildrenUnderCare
    ApplicationService.saveApplication(application)
    onSubmit(hookFormData.getValues())
  }

  useEffect(() => {
    console.log(defaultValues)
  }, [defaultValues])

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control: hookFormData.control,
      name: 'childrenUnderCare', // unique name for your Field Array
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
          onSubmit={submit}
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
                  name={`childrenUnderCare.${index}.name`}
                  defaultValue={field.name}
                  render={({ onChange, value }) => (
                    <div style={{ minWidth: '320px', flexGrow: 1 }}>
                      <Input
                        name={`childrenUnderCare.${index}.name`}
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
                  name={`childrenUnderCare.${index}.nationalId`}
                  defaultValue={field.nationalId}
                  render={({ onChange, value }) => (
                    <div style={{ minWidth: '320px', flexGrow: 1 }}>
                      <Input
                        name={`childrenUnderCare.${index}.nationalId`}
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
          <Button onClick={onBack}>Til baka</Button>
          <Button onClick={submit}>Næsta skref</Button>
        </Box>
      </FormProvider>
    </Stack>
  )
}

export default ChildrenUnderCare
