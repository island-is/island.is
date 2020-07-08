import React, { FC, useEffect } from 'react'
import {
  Answers,
  Field,
  FormItemTypes,
  FormScreen,
  MultiField,
  Schema,
  Section,
} from '@island.is/application/schema'
import { Typography, Box, Button, Divider } from '@island.is/island-ui/core'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'

type ScreenProps = {
  answers: Answers
  answerQuestions(Answers): void
  dataSchema: Schema
  shouldSubmit?: boolean
  nextScreen(): void
  prevScreen(): void
  screen: FormScreen
  section?: Section
}

const Screen: FC<ScreenProps> = ({
  answers,
  answerQuestions,
  dataSchema,
  nextScreen,
  prevScreen,
  shouldSubmit = false,
  screen,
  section,
}) => {
  const methods = useForm<Answers>({
    mode: 'onSubmit',
    defaultValues: answers,
    shouldUnregister: false,
    resolver,
    context: { dataSchema, formNode: screen },
  })
  useEffect(() => {
    methods.reset(answers)
  }, [screen])
  const onSubmit: SubmitHandler<Answers> = (data) => {
    if (shouldSubmit) {
      console.log('here we will submit')
    } else {
      answerQuestions(data)
      nextScreen()
    }
  }
  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Box>
          {section && (
            <Typography variant="breadcrumb">{section.name}</Typography>
          )}
          <Typography variant="h2">{screen.name}</Typography>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? null : screen.type ===
              FormItemTypes.MULTI_FIELD ? (
              <FormMultiField multiField={screen as MultiField} />
            ) : (
              <FormField autoFocus field={screen as Field} />
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
