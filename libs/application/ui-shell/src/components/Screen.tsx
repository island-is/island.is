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
import { FormScreen, ResolverContext, BeforeSubmitCallback } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import FormRepeater from './FormRepeater'
import FormExternalDataProvider from './FormExternalDataProvider'
import { extractAnswersToSubmitFromScreen, findSubmitField } from '../utils'
import { useLocale } from '@island.is/localization'
import ScreenFooter from './ScreenFooter'
import { useWindowSize } from 'react-use'
import { theme } from '@island.is/island-ui/theme'
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
  goToScreen: (id: string) => void
}

function handleError(error: string, formatMessage: MessageFormatter): void {
  toast.error(
    formatMessage(
      {
        id: 'application.system:submit.error',
        defaultMessage: 'Eitthvað fór úrskeiðis: {error}',
        description: 'Error message on submit',
      },
      { error },
    ),
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

  const refetch = useContext(RefetchContext)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION, {
    onError: (e) => handleError(e.message, formatMessage),
  })
  const [submitApplication, { loading: loadingSubmit }] = useMutation(
    SUBMIT_APPLICATION,
    {
      onError: (e) => handleError(e.message, formatMessage),
    },
  )
  const { handleSubmit, errors, reset } = hookFormData

  const submitField = useMemo(() => findSubmitField(screen), [screen])

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

    if (typeof beforeSubmitCallback.current === 'function') {
      const [canContinue] = await beforeSubmitCallback.current()

      if (!canContinue) {
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
    } else {
      response = await updateApplication({
        variables: {
          input: {
            id: applicationId,
            answers: extractAnswersToSubmitFromScreen(data, screen),
          },
        },
      })
    }

    if (response?.data) {
      answerAndGoToNextScreen(data)
      setBeforeSubmitCallback(null)
    }
  }

  function canProceed(): boolean {
    const isLoadingOrPending = loading || loadingSubmit

    return !isLoadingOrPending
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
          span={['12/12', '12/12', '7/9', '7/9']}
          offset={['0', '0', '1/9']}
        >
          <Text variant="h2" marginBottom={1}>
            {formatText(screen.title, application, formatMessage)}
          </Text>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                application={application}
                errors={errors}
                expandRepeater={expandRepeater}
                repeater={screen}
                onRemoveRepeaterItem={async (newRepeaterItems) => {
                  const newData = await updateApplication({
                    variables: {
                      input: {
                        id: applicationId,
                        answers: { [screen.id]: newRepeaterItems },
                      },
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
                errors={errors}
                multiField={screen}
                application={application}
                goToScreen={goToScreen}
              />
            ) : screen.type === FormItemTypes.EXTERNAL_DATA_PROVIDER ? (
              <FormExternalDataProvider
                addExternalData={addExternalData}
                setBeforeSubmitCallback={setBeforeSubmitCallback}
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
                goToScreen={goToScreen}
                refetch={refetch}
              />
            )}
          </Box>
        </GridColumn>
        <ToastContainer hideProgressBar closeButton useKeyframeStyles={false} />
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
