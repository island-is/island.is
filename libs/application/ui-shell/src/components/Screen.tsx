import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useMutation } from '@apollo/client'
import {
  Application,
  ExternalData,
  FormItemTypes,
  FormModes,
  FormValue,
  Schema,
  formatText,
  MessageFormatter,
  mergeAnswers,
  coreMessages,
  BeforeSubmitCallback,
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
  const [updateApplication, { loading, error }] = useMutation(
    UPDATE_APPLICATION,
    {
      onError: (e) => {
        // We only show the error message if it doesn't contains a json data object
        if (!isJSONObject(e.message)) {
          return handleError(e.message, formatMessage)
        }
      },
    },
  )
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleError(e.message, formatMessage),
    },
  )
  const { handleSubmit, errors, reset } = hookFormData
  const submitField = useMemo(() => findSubmitField(screen), [screen])
  const dataSchemaOrApiErrors = isJSONObject(error?.message)
    ? parseMessage(error?.message)
    : errors ?? {}

  const beforeSubmitCallback = useRef<BeforeSubmitCallback | null>(null)
  const setBeforeSubmitCallback = useCallback(
    (callback: BeforeSubmitCallback | null) => {
      beforeSubmitCallback.current = callback
    },
    [beforeSubmitCallback],
  )

  const goBack = useCallback(() => {
    // using deepmerge to prevent some weird react-hook-form read-only bugs
    reset(deepmerge({}, formValue))
    setBeforeSubmitCallback(null)
    prevScreen()
  }, [formValue, prevScreen, reset, setBeforeSubmitCallback])

  const onSubmit: SubmitHandler<FormValue> = async (data, e) => {
    let response

    setIsSubmitting(true)

    if (typeof beforeSubmitCallback.current === 'function') {
      const [canContinue] = await beforeSubmitCallback.current()

      if (!canContinue) {
        setIsSubmitting(false)
        // TODO set error message
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
      response = await updateApplication({
        variables: {
          input: {
            id: applicationId,
            answers: extractAnswersToSubmitFromScreen(
              mergeAnswers(formValue, data),
              screen,
            ),
          },
          locale,
        },
      })
    }

    if (response?.data) {
      answerAndGoToNextScreen(data)
      setBeforeSubmitCallback(null)
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
  }, [activeScreenIndex, isMobile])

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
                repeater={screen}
                onRemoveRepeaterItem={async (newRepeaterItems) => {
                  const newData = await updateApplication({
                    variables: {
                      input: {
                        id: applicationId,
                        answers: { [screen.id]: newRepeaterItems },
                      },
                      locale,
                    },
                  })
                  if (!newData.errors) {
                    answerQuestions(newData.data.updateApplication.answers)
                  }
                }}
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
