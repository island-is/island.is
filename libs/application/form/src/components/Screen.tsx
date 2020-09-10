import React, { FC, useCallback } from 'react'
import { useMutation } from '@apollo/client'
import {
  FormValue,
  FormItemTypes,
  Schema,
  Section,
  FormType,
  ExternalData,
} from '@island.is/application/template'
import {
  Typography,
  Box,
  Button,
  Divider,
  GridColumn,
} from '@island.is/island-ui/core'
import { UPDATE_APPLICATION } from '@island.is/application/graphql'
import deepmerge from 'deepmerge'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { FormScreen } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import FormRepeater from './FormRepeater'
import FormExternalDataProvider from './FormExternalDataProvider'
import { verifyExternalData } from '../utils'

import * as styles from './Screen.treat'

type ScreenProps = {
  answerAndGoToNextScreen(Answers): void
  formValue: FormValue
  formTypeId: FormType
  addExternalData(data: ExternalData): void
  answerQuestions(Answers): void
  dataSchema: Schema
  externalData: ExternalData
  shouldSubmit?: boolean
  expandRepeater(): void
  prevScreen(): void
  screen: FormScreen
  section?: Section
  applicationId?: string
}

const Screen: FC<ScreenProps> = ({
  formValue,
  addExternalData,
  answerQuestions,
  dataSchema,
  expandRepeater,
  externalData,
  answerAndGoToNextScreen,
  prevScreen,
  shouldSubmit = false,
  screen,
  section,
  applicationId,
}) => {
  const hookFormData = useForm<FormValue>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formValue,
    shouldUnregister: false,
    resolver,
    context: { dataSchema, formNode: screen },
  })

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading }] = useMutation(UPDATE_APPLICATION)

  const { handleSubmit, errors, reset } = hookFormData

  const goBack = useCallback(() => {
    // using deepmerge to prevent some weird react-hook-form read-only bugs
    reset(deepmerge({}, formValue))
    prevScreen()
  }, [formValue, prevScreen, reset])

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    if (shouldSubmit) {
      // call submit mutation
      console.log('here we will submit', formValue)
    } else {
      await updateApplication({
        variables: {
          input: {
            id: applicationId,
            answers: data,
          },
        },
      })
      console.log('these were my answers:', data)
      answerAndGoToNextScreen(data)
    }
  }

  function canProceed(): boolean {
    const isLoadingOrPending = loading
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
          offset={[null, '1/9']}
        >
          <Typography variant="h2">{screen.name}</Typography>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                expandRepeater={expandRepeater}
                repeater={screen}
                formValue={formValue}
              />
            ) : screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField
                answerQuestions={answerQuestions}
                errors={errors}
                multiField={screen}
                formValue={formValue}
                applicationId={applicationId}
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
                formValue={formValue}
                applicationId={applicationId}
              />
            )}
          </Box>
        </GridColumn>
        <Box marginTop={[3, 3, 0]} className={styles.buttonContainer}>
          <GridColumn
            span={['12/12', '12/12', '7/9', '7/9']}
            offset={[null, '1/9']}
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="spaceBetween"
              paddingTop={[1, 4]}
              paddingBottom={[1, 5]}
            >
              <Box display="inlineFlex" padding={2} paddingLeft="none">
                <Button variant="ghost" onClick={goBack}>
                  Til baka
                </Button>
              </Box>
              <Box display="inlineFlex" padding={2} paddingRight="none">
                {shouldSubmit ? (
                  <Button
                    loading={loading}
                    disabled={!canProceed()}
                    htmlType="submit"
                  >
                    Submit
                  </Button>
                ) : (
                  <Button
                    loading={loading}
                    disabled={!canProceed()}
                    icon="arrowRight"
                    htmlType="submit"
                  >
                    Halda áfram
                  </Button>
                )}
              </Box>
            </Box>
          </GridColumn>
        </Box>
      </Box>
    </FormProvider>
  )
}

export default Screen
