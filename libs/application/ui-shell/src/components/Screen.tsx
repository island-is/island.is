import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ApolloError, useMutation } from '@apollo/client'
import {
  coreMessages,
  formatTextWithLocale,
  getErrorReasonIfPresent,
  mergeAnswers,
} from '@island.is/application/core'
import {
  Application,
  ExternalData,
  FormItemTypes,
  FormModes,
  FormValue,
  Schema,
  BeforeSubmitCallback,
  Section,
  SetBeforeSubmitCallbackOptions,
} from '@island.is/application/types'
import {
  Box,
  GridColumn,
  Text,
  ToastContainer,
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
import {
  findProblemInApolloError,
  ProblemType,
} from '@island.is/shared/problem'
import { handleServerError } from '@island.is/application/ui-components'
import { FormScreen, ResolverContext } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import FormRepeater from './FormRepeater'
import FormExternalDataProvider from './FormExternalDataProvider'
import { extractAnswersToSubmitFromScreen, findSubmitField } from '../utils'
import ScreenFooter from './ScreenFooter'
import RefetchContext from '../context/RefetchContext'
import { Locale } from '@island.is/shared/types'
import { useUserInfo } from '@island.is/react-spa/bff'
import { uuid } from 'uuidv4'

type ScreenProps = {
  activeScreenIndex: number
  sections: Section[]
  addExternalData(data: ExternalData): void
  application: Application
  answerAndGoToNextScreen(answers: FormValue): void
  answerQuestions(answers: FormValue): void
  dataSchema: Schema
  expandRepeater(): void
  mode?: FormModes
  numberOfScreens: number
  totalDraftScreens?: number
  currentDraftScreen?: number
  prevScreen(): void
  screen: FormScreen
  renderLastScreenButton?: boolean
  renderLastScreenBackButton?: boolean
  goToScreen: (id: string) => void
  setUpdateForbidden: (value: boolean) => void
  canGoBack: boolean
}

const getServerValidationErrors = (error: ApolloError | undefined) => {
  const problem = findProblemInApolloError(error, [
    ProblemType.VALIDATION_FAILED,
  ])
  if (problem && problem.type === ProblemType.VALIDATION_FAILED) {
    return problem.fields
  }
  return null
}

const Screen: FC<React.PropsWithChildren<ScreenProps>> = ({
  setUpdateForbidden,
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
  totalDraftScreens,
  currentDraftScreen,
  renderLastScreenButton,
  renderLastScreenBackButton,
  screen,
  sections,
  canGoBack,
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
  const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(
    null,
  )
  const getServerErrorMessage = (
    error: ApolloError,
    formatLongErrorMessage?: (message: string) => string,
  ) => {
    const problem = findProblemInApolloError(error)
    const message = problem ? problem.detail ?? problem.title : error.message

    if (problem) {
      if ('errorReason' in problem) {
        const { title, summary } = getErrorReasonIfPresent(problem.errorReason)
        const formattedMessage = `${formatMessage(title)}: ${formatMessage(
          summary,
        )}`
        return formatLongErrorMessage
          ? formatLongErrorMessage(formattedMessage)
          : formattedMessage
      }
    }
    return message
  }

  const [fieldLoadingState, setFieldLoadingState] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const refetch = useContext<() => void>(RefetchContext)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading, error: updateApplicationError }] =
    useMutation(UPDATE_APPLICATION, {
      onError: (e) => {
        // We handle validation problems separately.
        const problem = findProblemInApolloError(e)
        if (problem?.type === ProblemType.HTTP_NOT_FOUND) {
          setUpdateForbidden(true)
        }
        if (problem?.type === ProblemType.VALIDATION_FAILED) {
          return
        }

        return handleServerError(e, formatMessage)
      },
    })
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => {
        setServerErrorMessage(
          getServerErrorMessage(e, submitField?.formatLongErrorMessage),
        )
        handleServerError(e, formatMessage)
      },
    },
  )
  const {
    handleSubmit,
    formState: { errors: formErrors },
    reset,
  } = hookFormData

  const user = useUserInfo()

  const submitField = useMemo(() => {
    const foundSubmitField = findSubmitField(screen)

    if (!foundSubmitField) {
      return undefined
    }

    const submitFieldCondition = foundSubmitField
      ?.map((field) => {
        if (typeof field.condition === 'function') {
          return field.condition(formValue, externalData, user)
            ? field
            : undefined
        }
        return field
      })
      .filter(Boolean)
    return submitFieldCondition.length > 0 ? submitFieldCondition[0] : undefined
  }, [formValue, externalData, screen, user])

  const [beforeSubmitError, setBeforeSubmitError] = useState({})
  const beforeSubmitCallback = useRef<BeforeSubmitCallback | null>(null)
  const beforeSubmitCallbacksMap = useRef<Map<string, BeforeSubmitCallback>>(
    new Map(),
  )

  const setBeforeSubmitCallback = useCallback(
    (
      callback: BeforeSubmitCallback | null,
      options?: SetBeforeSubmitCallbackOptions,
    ) => {
      // Unique ID for this callback to prevent registering the same callback when using multiple
      const id = options?.customCallbackId ?? uuid()

      // If null is passed, clear the current beforeSubmit callback
      if (callback === null) {
        beforeSubmitCallbacksMap.current.clear()
        beforeSubmitCallback.current = null
        return
      }

      if (!options?.allowMultiple) {
        // Replace all existing callbacks with just this one
        beforeSubmitCallbacksMap.current = new Map([[id, callback]])
      } else {
        // Deduplicate by id
        beforeSubmitCallbacksMap.current.set(id, callback)
      }

      // Rebuild a single composed callback from all callbacks in the map
      beforeSubmitCallback.current = async (event) => {
        for (const [_id, cb] of beforeSubmitCallbacksMap.current.entries()) {
          const [ok, message] = await cb(event)
          if (!ok) return [ok, message]
        }
        return [true, null]
      }
    },
    [beforeSubmitCallback], // Only re-create this function if the ref changes
  )

  const parsedUpdateApplicationError = getServerValidationErrors(
    updateApplicationError,
  )

  const dataSchemaOrApiErrors = {
    ...parsedUpdateApplicationError,
    ...beforeSubmitError,
    ...formErrors,
  }

  const goBack = useCallback(() => {
    setSubmitButtonDisabled(false)
    // using deepmerge to prevent some weird react-hook-form read-only bugs
    reset(deepmerge({}, formValue))
    prevScreen()
  }, [formValue, prevScreen, reset])

  const onSubmit: SubmitHandler<FormValue> = async (data, e) => {
    let response

    setIsSubmitting(true)
    setServerErrorMessage(null)
    setBeforeSubmitError({})

    let event: string | undefined
    if (submitField !== undefined) {
      const finalAnswers = { ...formValue, ...data }
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
    }

    if (typeof beforeSubmitCallback.current === 'function') {
      const [canContinue, possibleError] = await beforeSubmitCallback.current(
        event,
      )

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

        if (
          submitField.refetchApplicationAfterSubmit === true ||
          (typeof submitField.refetchApplicationAfterSubmit === 'function' &&
            submitField.refetchApplicationAfterSubmit(event))
        ) {
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
            draftProgress: {
              stepsFinished: currentDraftScreen ?? screen.sectionIndex,
              totalSteps: totalDraftScreens ?? sections.length - 1,
            },
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
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false)
  const { width } = useWindowSize()
  const headerHeight = 85

  const nextButtonText = screen.nextButtonText ?? coreMessages.buttonNext

  useEffect(() => {
    if (width < theme.breakpoints.md) {
      return setIsMobile(true)
    }
    setIsMobile(false)
  }, [width])

  useEffect(() => {
    if (beforeSubmitCallback.current !== null) {
      setBeforeSubmitCallback(null)
    }
  }, [activeScreenIndex, setBeforeSubmitCallback])

  useEffect(() => {
    const target = isMobile ? headerHeight : 0
    window.scrollTo(0, target)
  }, [activeScreenIndex, isMobile])

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
            [screen.id]: newRepeaterItems as FormValue[],
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
  const shouldCreateTopLevelRegion = !(
    screen.type === FormItemTypes.REPEATER ||
    screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER
  )

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
          <Text
            variant="h2"
            as="h2"
            marginBottom={1}
            {...(shouldCreateTopLevelRegion ? { id: screen.id } : {})}
          >
            {formatTextWithLocale(
              screen.title ?? '',
              application,
              locale as Locale,
              formatMessage,
            )}
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
                setSubmitButtonDisabled={setSubmitButtonDisabled}
              />
            ) : screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER ? (
              <FormExternalDataProvider
                application={application}
                addExternalData={addExternalData}
                setBeforeSubmitCallback={setBeforeSubmitCallback}
                applicationId={applicationId}
                externalData={externalData}
                externalDataProvider={screen}
                formValue={formValue}
                errors={dataSchemaOrApiErrors}
              />
            ) : (
              <Box component="section" aria-labelledby={screen.id}>
                <FormField
                  autoFocus
                  setBeforeSubmitCallback={setBeforeSubmitCallback}
                  setFieldLoadingState={setFieldLoadingState}
                  errors={dataSchemaOrApiErrors}
                  field={screen}
                  application={application}
                  goToScreen={goToScreen}
                  refetch={refetch}
                  setSubmitButtonDisabled={setSubmitButtonDisabled}
                  answerQuestions={answerQuestions}
                />
              </Box>
            )}
          </Box>
        </GridColumn>

        {!submitField?.renderLongErrors && (
          <ToastContainer
            hideProgressBar
            closeButton
            useKeyframeStyles={false}
          />
        )}
        {submitField?.renderLongErrors && serverErrorMessage ? (
          <Box
            background="red100"
            borderRadius="standard"
            padding={2}
            marginRight={4}
            marginLeft={4}
            textAlign="center"
          >
            <Text whiteSpace="preLine">{serverErrorMessage}</Text>
          </Box>
        ) : null}
        <ScreenFooter
          submitButtonDisabled={submitButtonDisabled}
          application={application}
          renderLastScreenButton={renderLastScreenButton}
          renderLastScreenBackButton={renderLastScreenBackButton}
          activeScreenIndex={activeScreenIndex}
          numberOfScreens={numberOfScreens}
          mode={mode}
          goBack={goBack}
          canGoBack={canGoBack}
          submitField={submitField}
          loading={loading}
          canProceed={!isLoadingOrPending}
          nextButtonText={nextButtonText}
        />
      </Box>
    </FormProvider>
  )
}

export default Screen
