import React, { useContext, useEffect, useState } from 'react'
import {
  Stack,
  Box,
  Select,
  Button,
  DatePicker
} from '@island.is/island-ui/core'
import { useForm, FormProvider, Controller } from 'react-hook-form'
import { ApplicationData } from './../../entities/application-data'
import { ApplicationService } from './../../services/application.service'
import { ServiceContext } from '../util/ServicesProvider'
import { EndOfEmployment } from './../../entities/end-of-employment'
import { UnemploymentStep } from './../../entities/enums/unemployment-step.enum'

interface PropTypes {
  onBack: () => void
  onSubmit: (data) => void
  defaultValues: ApplicationData
}

const EndOfEmploymentForm: React.FC<PropTypes> = ({
  onBack,
  onSubmit,
  defaultValues,
}: PropTypes) => {
  const hookFormData = useForm<ApplicationData>()
  const context = useContext(ServiceContext)
  const [reasons, setReasons] = useState<string[]>([])
  const [circumStances, setCircumstances] = useState<string[]>([])

  const submit = () => {
    const application = defaultValues
    if (!application.endOfEmployment){
      application.endOfEmployment = new EndOfEmployment()
    }
    
    application.endOfEmployment.dateFrom = hookFormData.getValues().endOfEmployment.dateFrom
    application.endOfEmployment.howUnemploymentCameAbout = hookFormData.getValues().endOfEmployment.howUnemploymentCameAbout
    application.endOfEmployment.reasonForUnemployment = hookFormData.getValues().endOfEmployment.reasonForUnemployment
    application.stepCompleted = UnemploymentStep.EndOfEmployment
    ApplicationService.saveApplication(application)
    onSubmit(hookFormData.getValues())
  }

  useEffect(() => {
    async function loadReasons() {
      if (reasons.length === 0) {
        setReasons(await context.directorateOfLabourService.getReasonForUnEmployment())
      }
      if (circumStances.length === 0) {
        setCircumstances(await context.directorateOfLabourService.getCircumstancesForUnEmployment())
      }
    }
    loadReasons()
   }, [defaultValues])

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
            <Controller
                name="endOfEmployment.dateFrom"
                defaultValue={defaultValues?.initialInfo?.dateFrom ? defaultValues?.initialInfo?.dateFrom : new Date()}
                render={({ onChange, value }) => (
                  <DatePicker
                    label="Frá hvaða dag hefur þú verið atvinnulaus"
                    placeholderText="Veldu dagsetningu"
                    locale="is"
                    selected={value}
                    handleChange={onChange}
                  />
                )}
              />
            </Stack>

            <Stack space={2}>

            <Controller
                name="endOfEmployment.howUnemploymentCameAbout"
                defaultValue=""
                render={({ onChange, value }) => {
                  return (
                    <Select
                      label="Hvað lýsir best þínum aðstæðum"
                      name="endOfEmployment.howUnemploymentCameAbout"
                      options={circumStances.map((x) => ({label: x, value: x}))}
                      placeholder="Veldu ástæðu"
                      value={circumStances.map((x) => ({label: x, value: x})).find(
                        (option) => option === value,
                      )}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Stack>

            <Stack space={2}>

            <Controller
                name="endOfEmployment.reasonForUnemployment"
                defaultValue=""
                render={({ onChange, value }) => {
                  return (
                    <Select
                      label="Hvað lýsir starfslokum þínum best"
                      name="endOfEmployment.reasonForUnemployment"
                      options={reasons.map((x) => ({label: x, value: x}))}
                      placeholder="Veldu ástæðu"
                      value={reasons.map((x) => ({label: x, value: x})).find(
                        (option) => option === value,
                      )}
                      onChange={onChange}
                    />
                  )
                }}
              />
            </Stack>
        </Box>
        <Box paddingTop={2}>
              <Button onClick={onBack} width="fluid">
                  Til baka
              </Button>
              <Button onClick={submit} width="fluid">
                Næsta skref
              </Button>
            </Box>
      </FormProvider>
    </Stack>
  )
}

export default EndOfEmploymentForm
