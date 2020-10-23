import React, { FC, useCallback, useMemo } from 'react'
import { useMutation } from '@apollo/client'
import {
  Application,
  ExternalData,
  FormItemTypes,
  FormModes,
  FormValue,
  Schema,
  formatText,
} from '@island.is/application/core'
import { Box, GridColumn, Text } from '@island.is/island-ui/core'
import {
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import deepmerge from 'deepmerge'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { FormScreen, ResolverContext } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import FormRepeater from './FormRepeater'
import FormExternalDataProvider from './FormExternalDataProvider'
import { findSubmitField, verifyExternalData } from '../utils'
import { useLocale } from '@island.is/localization'
import ScreenFooter from './ScreenFooter'

type ScreenProps = {
  activeScreenIndex: number
  addExternalData(data: ExternalData): void
  application: Application
  answerAndGoToNextScreen(answers: FormValue): void
  answerQuestions(answers: FormValue): void
  dataSchema: Schema
  expandRepeater(): void
  mode?: FormModes
  numberOfScreens: number
  prevScreen(): void
  screen: FormScreen
}

const Screen: FC<ScreenProps> = ({
  activeScreenIndex,
  addExternalData,
  answerQuestions,
  application,
  dataSchema,
  expandRepeater,
  answerAndGoToNextScreen,
  mode,
  numberOfScreens,
  prevScreen,
  screen,
}) => {
  const { answers: formValue, externalData, id: applicationId } = application
  const { formatMessage } = useLocale()
  const hookFormData = useForm<FormValue, ResolverContext>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formValue,
    shouldUnregister: false,
    resolver,
    context: { dataSchema, formNode: screen },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
  )
  const { handleSubmit, errors, reset } = hookFormData

  const submitField = useMemo(() => findSubmitField(screen), [screen])

  const goBack = useCallback(() => {
    // using deepmerge to prevent some weird react-hook-form read-only bugs
    reset(deepmerge({}, formValue))
    prevScreen()
  }, [formValue, prevScreen, reset])

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    if (submitField !== undefined) {
      const finalAnswers = { ...formValue, ...data }

      const event = submitField
        ? finalAnswers[submitField.id] ?? 'SUBMIT'
        : 'SUBMIT'
      await submitApplication({
        variables: {
          input: {
            id: applicationId,
            event,
            answers: finalAnswers,
          },
        },
      })
    } else {
      await updateApplication({
        variables: {
          input: {
            id: applicationId,
            answers: data,
          },
        },
      })
    }
    answerAndGoToNextScreen(data)
  }

  function canProceed(): boolean {
    const isLoadingOrPending = loading || loadingSubmit
    if (screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER) {
      return (
        !isLoadingOrPending &&
        verifyExternalData(externalData, screen.dataProviders)
      )
    }
    return !isLoadingOrPending
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
        style={{ minHeight: '65vh' }}
      >
        <GridColumn
          span={['12/12', '12/12', '7/9', '7/9']}
          offset={['0', '0', '1/9']}
        >
          <Text variant="h2">
            {formatText(screen.name, application, formatMessage)}
          </Text>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                application={application}
                errors={errors}
                expandRepeater={expandRepeater}
                repeater={screen}
              />
            ) : screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField
                answerQuestions={answerQuestions}
                errors={errors}
                multiField={screen}
                application={application}
              />
            ) : screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER ? (
              <FormExternalDataProvider
                addExternalData={addExternalData}
                applicationId={applicationId}
                externalData={externalData}
                externalDataProvider={screen}
                formValue={formValue}
              />
            ) : (
              <FormField
                autoFocus
                errors={errors}
                field={screen}
                application={application}
              />
            )}
          </Box>
        </GridColumn>
        <ScreenFooter
          application={application}
          activeScreenIndex={activeScreenIndex}
          numberOfScreens={numberOfScreens}
          mode={mode}
          goBack={goBack}
          submitField={submitField}
          loading={loading}
          canProceed={canProceed()}
        />
      </Box>
    </FormProvider>
  )
}

export default Screen
