import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import get from 'lodash/get'
import { useMutation } from '@apollo/client'
import {
  Application,
  Answer,
  ExternalData,
  FormItemTypes,
  FormModes,
  FormValue,
  Schema,
  formatText,
  MessageFormatter,
  mergeAnswers,
  coreMessages,
  coreErrorMessages,
  BeforeSubmitCallback,
  getValueViaPath,
  RecordObject,
} from '@island.is/application/core'
import {
  Box,
  GridColumn,
  Text,
  ToastContainer,
  toast,
} from '@island.is/island-ui/core'
import {
  SUBMIT_APPLICATION,
  UPDATE_APPLICATION,
} from '@island.is/application/graphql'
import deepmerge from 'deepmerge'
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form'
import { useLocale } from '@island.is/localization'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'

import { FormScreen, ResolverContext } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import FormRepeater from './FormRepeater'
import FormExternalDataProvider from './FormExternalDataProvider'
import {
  extractAnswersToSubmitFromScreen,
  findSubmitField,
  getFieldsWithNoAnswer,
  isJSONObject,
  parseMessage,
} from '../utils'
import ScreenFooter from './ScreenFooter'
import RefetchContext from '../context/RefetchContext'

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
  renderLastScreenButton?: boolean
  renderLastScreenBackButton?: boolean
  goToScreen: (id: string) => void
}

function parseErrorMessage(error: string) {
  if (!error) {
    return 'Unknown error'
  }

  if (isJSONObject(error)) {
    const errorObj = JSON.parse(error)

    return errorObj.message ?? error
  }

  return error
}

function handleError(error: string, formatMessage: MessageFormatter): void {
  toast.error(
    formatMessage(coreMessages.updateOrSubmitError, {
      error: parseErrorMessage(error),
    }),
  )
}

const Screen: FC<ScreenProps> = ({
  activeScreenIndex,
  addExternalData,
  answerQuestions,
  application,
  dataSchema,
  expandRepeater,
  goToScreen,
  answerAndGoToNextScreen,
  mode,
  numberOfScreens,
  prevScreen,
  renderLastScreenButton,
  renderLastScreenBackButton,
  screen,
}) => {
  const { answers: formValue, externalData, id: applicationId } = application
  const { lang: locale, formatMessage } = useLocale()
  const hookFormData = useForm<FormValue, ResolverContext>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formValue,
    shouldUnregister: false,
    resolver: (formValue, context) =>
      resolver({ formValue, context, formatMessage }),
    context: { dataSchema, formNode: screen },
  })
  const [fieldLoadingState, setFieldLoadingState] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const refetch = useContext<() => void>(RefetchContext)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [
    updateApplication,
    { loading, error: updateApplicationError },
  ] = useMutation(UPDATE_APPLICATION, {
    onError: (e) => {
      // We only show the error message if it doesn't contains a json data object
      if (!isJSONObject(e.message)) {
        return handleError(e.message, formatMessage)
      }
    },
  })
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleError(e.message, formatMessage),
    },
  )
  const { handleSubmit, errors: formErrors, reset } = hookFormData
  const submitField = useMemo(() => findSubmitField(screen), [screen])

  const [beforeSubmitError, setBeforeSubmitError] = useState({})
  const beforeSubmitCallback = useRef<BeforeSubmitCallback | null>(null)

  const setBeforeSubmitCallback = useCallback(
    (callback: BeforeSubmitCallback | null) => {
      beforeSubmitCallback.current = callback
    },
    [beforeSubmitCallback],
  )

  const parsedUpdateApplicationError =
    updateApplicationError && isJSONObject(updateApplicationError?.message)
      ? parseMessage(updateApplicationError.message)
      : {}

  const dataSchemaOrApiErrors = {
    ...parsedUpdateApplicationError,
    ...beforeSubmitError,
    ...formErrors,
  }

  const goBack = useCallback(() => {
    // using deepmerge to prevent some weird react-hook-form read-only bugs
    reset(deepmerge({}, formValue))
    prevScreen()
  }, [formValue, prevScreen, reset])

  const onSubmit: SubmitHandler<FormValue> = async (data, e) => {
    let response

    setIsSubmitting(true)
    setBeforeSubmitError({})

    if (typeof beforeSubmitCallback.current === 'function') {
      const [canContinue, possibleError] = await beforeSubmitCallback.current()

      if (!canContinue) {
        setIsSubmitting(false)

        if (typeof possibleError === 'string' && screen && screen.id) {
          setBeforeSubmitError({ [screen.id]: possibleError })
        }

        return
      }
    }

    if (submitField !== undefined) {
      const finalAnswers = { ...formValue, ...data }
      let event: string
      if (submitField.placement === 'screen') {
        event = (finalAnswers[submitField.id] as string) ?? 'SUBMIT'
      } else {
        if (submitField.actions.length === 1) {
          const actionEvent = submitField.actions[0].event
          event =
            typeof actionEvent === 'object' ? actionEvent.type : actionEvent
        } else {
          const nativeEvent = e?.nativeEvent as { submitter: { id: string } }
          event = nativeEvent?.submitter?.id ?? 'SUBMIT'
        }
      }

      response = await submitApplication({
        variables: {
          input: {
            id: applicationId,
            event,
            answers: finalAnswers,
          },
        },
      })

      if (response?.data) {
        addExternalData(response.data?.submitApplication.externalData)

        if (submitField.refetchApplicationAfterSubmit) {
          refetch()
        }
      }
    } else {
      const extractedAnswers = extractAnswersToSubmitFromScreen(
        mergeAnswers(formValue, data),
        screen,
      )

      response = await updateApplication({
        variables: {
          input: {
            id: applicationId,
            answers: extractedAnswers,
          },
          locale,
        },
      })
    }

    if (response?.data) {
      answerAndGoToNextScreen(data)
    }

    setIsSubmitting(false)
  }

  const [isMobile, setIsMobile] = useState(false)
  const { width } = useWindowSize()
  const headerHeight = 85

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  useEffect(() => {
    const target = isMobile ? headerHeight : 0
    window.scrollTo(0, target)

    if (beforeSubmitCallback.current !== null) {
      setBeforeSubmitCallback(null)
    }
  }, [activeScreenIndex, isMobile, setBeforeSubmitCallback])

  const onUpdateRepeater = async (newRepeaterItems: unknown[]) => {
    if (!screen.id) {
      return {}
    }

    const newData = await updateApplication({
      variables: {
        input: {
          id: applicationId,
          answers: { [screen.id]: newRepeaterItems },
        },
        locale,
      },
    })

    if (!!newData && !newData.errors) {
      answerQuestions(newData.data.updateApplication.answers)
      reset(
        deepmerge(
          {},
          {
            ...formValue,
            [screen.id]: newRepeaterItems as Answer[],
          },
        ),
      )
    }

    return {
      errors: newData?.errors,
    }
  }

  const isLoadingOrPending =
    fieldLoadingState || loading || loadingSubmit || isSubmitting

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
        <GridColumn
          span={['12/12', '12/12', '10/12', '7/9']}
          offset={['0', '0', '1/12', '1/9']}
        >
          <Text variant="h2" as="h2" marginBottom={1}>
            {formatText(screen.title, application, formatMessage)}
          </Text>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                application={application}
                errors={dataSchemaOrApiErrors}
                expandRepeater={expandRepeater}
                setBeforeSubmitCallback={setBeforeSubmitCallback}
                setFieldLoadingState={setFieldLoadingState}
                repeater={screen}
                onUpdateRepeater={onUpdateRepeater}
              />
            ) : screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField
                answerQuestions={answerQuestions}
                setBeforeSubmitCallback={setBeforeSubmitCallback}
                setFieldLoadingState={setFieldLoadingState}
                errors={dataSchemaOrApiErrors}
                multiField={screen}
                application={application}
                goToScreen={goToScreen}
                refetch={refetch}
              />
            ) : screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER ? (
              <FormExternalDataProvider
                addExternalData={addExternalData}
                setBeforeSubmitCallback={setBeforeSubmitCallback}
                applicationId={applicationId}
                externalData={externalData}
                externalDataProvider={screen}
                formValue={formValue}
                errors={dataSchemaOrApiErrors}
              />
            ) : (
              <FormField
                autoFocus
                setBeforeSubmitCallback={setBeforeSubmitCallback}
                setFieldLoadingState={setFieldLoadingState}
                errors={dataSchemaOrApiErrors}
                field={screen}
                application={application}
                goToScreen={goToScreen}
                refetch={refetch}
              />
            )}
          </Box>
        </GridColumn>

        <ToastContainer hideProgressBar closeButton useKeyframeStyles={false} />

        <ScreenFooter
          application={application}
          renderLastScreenButton={renderLastScreenButton}
          renderLastScreenBackButton={renderLastScreenBackButton}
          activeScreenIndex={activeScreenIndex}
          numberOfScreens={numberOfScreens}
          mode={mode}
          goBack={goBack}
          submitField={submitField}
          loading={loading}
          canProceed={!isLoadingOrPending}
        />
      </Box>
    </FormProvider>
  )
}

export default Screen
