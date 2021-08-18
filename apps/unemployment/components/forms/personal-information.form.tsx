import React, { useEffect, useState } from 'react'
import {
  Stack,
  Box,
  Text,
  Divider,
  Input,
  Button,
} from '@island.is/island-ui/core'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { ApplicationData } from './../../entities/application-data'
import ValidationUtils from './../../utils/validation.utils'
import { ApplicationService } from './../../services/application.service'
import { UnemploymentStep } from './../../entities/enums/unemployment-step.enum'
import { InitialInfo } from './../../entities/initial-info'

interface PropTypes {
  onSubmit: (data) => void
  defaultValues: ApplicationData
  onBack: () => void
}

const PersonalInformationForm: React.FC<PropTypes> = ({
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const hookFormData = useForm<ApplicationData>()
  //  const [applicationData, setApplicationData] = useState<ApplicationData>(new ApplicationData)

  const submit = () => {
    const application = defaultValues;
    if (!application.initialInfo) {
      application.initialInfo = new InitialInfo()
    }
    application.initialInfo.email = hookFormData.getValues().initialInfo.email
    application.initialInfo.mobile = hookFormData.getValues().initialInfo.mobile
    application.stepCompleted = UnemploymentStep.PersonalInformation
    ApplicationService.saveApplication(application)
    onSubmit(hookFormData.getValues())
  }

  useEffect(() => {
    // setApplicationData(defaultValues)
    console.log(defaultValues)
  }, [defaultValues])



  return (
    <Box paddingY={10}>
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
              <Text variant="h1" marginBottom={3}>Samskipti</Text>
              <Box width="half">

                <Controller
                  name="initialInfo.email"
                  defaultValue={defaultValues.initialInfo.email}
                  render={({ onChange, value }) => (
                    <Input
                      data-cy="email"
                      name="initialInfo.email"
                      placeholder="Netfang"
                      value={value}
                      onChange={onChange}
                      label="Netfang"
                      required={true}
                      errorMessage="Nauðsynlegt er að fylla út netfang"
                      hasError={!ValidationUtils.validateEmail(value)}
                    />
                  )}
                />
              </Box>
            </Stack>

            <Stack space={2}>
              <br />
              <Box width="half">

                <Controller
                  name="initialInfo.mobile"
                  defaultValue={defaultValues.initialInfo.mobile}
                  render={({ onChange, value }) => (
                    <Input
                      data-cy="mobile"
                      name="initialInfo.mobile"
                      placeholder="Farsími"
                      value={value}
                      onChange={onChange}
                      label="Farsími"
                      required={true}
                      errorMessage="Nauðsynlegt er að fylla út farsímanúmer"
                      hasError={!ValidationUtils.validatePhoneNumber(value)}
                    />
                  )}
                />
              </Box>
            </Stack>
          </Box>
          <br/>
          <Box paddingTop={2}>
            <Button onClick={submit} width="fluid" data-cy="personalinfo-next-step-btn">
              Næsta skref
              </Button>
          </Box>
        </FormProvider>
      </Stack>
    </Box>

  )
}

export default PersonalInformationForm
