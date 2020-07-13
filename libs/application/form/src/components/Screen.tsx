import React, { FC, useEffect } from 'react'
import {
  FormValue,
  FormItemTypes,
  Schema,
  Section,
} from '@island.is/application/schema'
import { Typography, Box, Button, Divider } from '@island.is/island-ui/core'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { FieldDef, FormScreen, MultiFieldScreen } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import ConditionHandler from './ConditionHandler'

type ScreenProps = {
  formValue: FormValue
  answerQuestions(Answers): void
  dataSchema: Schema
  shouldSubmit?: boolean
  nextScreen(): void
  prevScreen(): void
  screen: FormScreen
  section?: Section
}

const Screen: FC<ScreenProps> = ({
  formValue,
  answerQuestions,
  dataSchema,
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

  useEffect(() => {
    reset(formValue)
  }, [screen, reset, formValue])

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
      <form onSubmit={handleSubmit(onSubmit)}>
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
            {screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField multiField={screen as MultiFieldScreen} />
            ) : (
              <FormField autoFocus field={screen as FieldDef} />
            )}
          </Box>
          <Divider />
          <Box bottom={0} paddingTop={7} paddingBottom={7}>
            <Box padding={2}>
              <Button variant="text" leftIcon="arrowLeft" onClick={prevScreen}>
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
