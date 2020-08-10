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
  const methods = useForm<FormValue>({
    mode: 'onBlur',
    defaultValues: formValue,
    shouldUnregister: false,
    resolver,
    context: { dataSchema, formNode: screen },
  })

  const { reset, handleSubmit } = methods

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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} key={screen.id}>
        <ConditionHandler
          answerQuestions={answerQuestions}
          formValue={formValue}
          screen={screen}
        />
        <Box>
          {section && (
            <Typography variant="breadcrumb">{section.name}</Typography>
          )}
          <Typography variant="h2">{screen.name}</Typography>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                expandRepeater={expandRepeater}
                repeater={screen}
                formValue={formValue}
              />
            ) : screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField multiField={screen} />
            ) : (
              <FormField autoFocus field={screen} />
            )}
          </Box>
          <Divider />
          <Box bottom={0} paddingTop={7} paddingBottom={7}>
            <Box padding={2}>
              <Button variant="text" leftIcon="arrowLeft" onClick={goBack}>
                Til baka
              </Button>
            </Box>
            <Box padding={2}>
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
      </form>
    </FormProvider>
  )
}

export default Screen
