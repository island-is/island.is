import React, { FC } from 'react'
import {
  FormValue,
  FormItemTypes,
  Schema,
  Section,
} from '@island.is/application/schema'
import { Typography, Box, Button, Divider } from '@island.is/island-ui/core'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { FormScreen } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import ConditionHandler from './ConditionHandler'
import FormRepeater from './FormRepeater'

type ScreenProps = {
  formValue: FormValue
  answerQuestions(Answers): void
  dataSchema: Schema
  shouldSubmit?: boolean
  expandRepeater(): void
  nextScreen(): void
  prevScreen(): void
  screen: FormScreen
  section?: Section
}

const Screen: FC<ScreenProps> = ({
  formValue,
  answerQuestions,
  dataSchema,
  expandRepeater,
  nextScreen,
  prevScreen,
  shouldSubmit = false,
  screen,
  section,
}) => {
  const hookFormData = useForm<FormValue>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formValue,
    shouldUnregister: false,
    resolver,
    context: { dataSchema, formNode: screen },
  })

  const { reset, handleSubmit, errors } = hookFormData

  const goBack = () => {
    reset()
    prevScreen()
  }

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    if (shouldSubmit) {
      console.log('here we will submit', formValue)
    } else {
      console.log('these were my answers:', data)
      answerQuestions(data)
      nextScreen()
    }
  }
  return (
    <FormProvider {...hookFormData}>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        justifyContent="spaceBetween"
        key={screen.id}
        height="full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <ConditionHandler
          answerQuestions={answerQuestions}
          formValue={formValue}
          screen={screen}
        />
        <Box flexGrow={1}>
          {section && <Typography color="dark300">{section.name}</Typography>}
          <Typography variant="h2">{screen.name}</Typography>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                expandRepeater={expandRepeater}
                repeater={screen}
                formValue={formValue}
              />
            ) : screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField errors={errors} multiField={screen} />
            ) : (
              <FormField autoFocus errors={errors} field={screen} />
            )}
          </Box>
        </Box>
        <Box marginTop={[3, 3, 0]}>
          <Divider weight="regular" />
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="spaceBetween"
            paddingTop={[1, 4]}
            paddingBottom={[1, 5]}
          >
            <Box display="inlineFlex" padding={2} paddingLeft="none">
              <Button variant="text" leftIcon="arrowLeft" onClick={goBack}>
                Til baka
              </Button>
            </Box>
            <Box display="inlineFlex" padding={2} paddingRight="none">
              {shouldSubmit ? (
                <Button htmlType="submit">Submit</Button>
              ) : (
                <Button variant="text" icon="arrowRight" htmlType="submit">
                  Halda áfram
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default Screen
