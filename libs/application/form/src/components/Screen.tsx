import React, { FC, useState } from 'react'
import {
  FormValue,
  FormItemTypes,
  Schema,
  Section,
  FormType,
} from '@island.is/application/schema'
import { Typography, Box, Button, Divider } from '@island.is/island-ui/core'
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form'
import { FormScreen } from '../types'
import FormMultiField from './FormMultiField'
import FormField from './FormField'
import { resolver } from '../validation/resolver'
import ConditionHandler from './ConditionHandler'
import FormRepeater from './FormRepeater'
import { useMutation } from '@apollo/client'
import { CREATE_APPLICATION } from '../graphql/mutations/createApplication'
import { UPDATE_APPLICATION } from '../graphql/mutations/updateApplication'
import { CREATE_UPLOAD_URL } from '../graphql/mutations/createUploadUrl'
import { ADD_ATTACHMENT } from '../graphql/mutations/addAttachment'
import { DELETE_ATTACHMENT } from '../graphql/mutations/deleteAttachment'

type ScreenProps = {
  formValue: FormValue
  formTypeId: FormType
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
  formTypeId,
  answerQuestions,
  dataSchema,
  expandRepeater,
  nextScreen,
  prevScreen,
  shouldSubmit = false,
  screen,
  section,
}) => {
  const [existingApplicationId, setExistingApplicationId] = useState(null) // TODO move to form reducer state
  const hookFormData = useForm<FormValue>({
    mode: 'onBlur',
    reValidateMode: 'onBlur',
    defaultValues: formValue,
    shouldUnregister: false,
    resolver,
    context: { dataSchema, formNode: screen },
  })

  const [createApplication, { loading: createPending }] = useMutation(
    CREATE_APPLICATION,
    {
      onCompleted({ createApplication }) {
        setExistingApplicationId(createApplication.id)
      },
    },
  )

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [updateApplication, { loading, data: updateData }] = useMutation(
    UPDATE_APPLICATION,
  )

  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)

  const [addAttachment] = useMutation(ADD_ATTACHMENT)

  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT)

  const { handleSubmit, errors, reset } = hookFormData

  const goBack = () => {
    reset(formValue)
    prevScreen()
  }

  const onFileChange = async (e) => {
    const file = e.target.files[0]
    const form = new FormData()
    console.log('file', file)

    const { data } = await createUploadUrl({
      variables: {
        filename: file.name,
      },
    })

    const {
      createUploadUrl: { url, fields },
    } = data
    Object.keys(fields).forEach((key) => form.append(key, fields[key]))
    form.append('file', file)

    // Send the POST request
    const response = await fetch(url, { method: 'POST', body: form })

    if (!response.ok) return 'Failed to upload via presigned POST'

    addAttachment({
      variables: {
        input: {
          id: existingApplicationId,
          key: fields.key,
          url: `${response.url}/${fields.key}`,
        },
      },
    })

    // Done!
    return `File uploaded via presigned POST with key: `
  }

  const onSubmit: SubmitHandler<FormValue> = async (data) => {
    if (shouldSubmit) {
      // call submit mutation
      console.log('here we will submit', formValue)
    } else {
      if (existingApplicationId) {
        await updateApplication({
          variables: {
            input: {
              id: existingApplicationId,
              typeId: formTypeId,
              answers: data,
            },
          },
        })
      } else {
        await createApplication({
          variables: {
            input: {
              applicant: '123456-1234',
              state: 'PENDING',
              attachments: {},
              typeId: formTypeId,
              assignee: '123456-1235',
              externalId: 'some_id',
              answers: data,
            },
          },
        })
      }
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
          <div>
            <strong>Step 3 - Choose a file</strong>
            <br />
            <input type="file" id="fileinput" onChange={onFileChange} />
          </div>
          <Box>
            {screen.type === FormItemTypes.REPEATER ? (
              <FormRepeater
                expandRepeater={expandRepeater}
                repeater={screen}
                formValue={formValue}
              />
            ) : screen.type === FormItemTypes.MULTI_FIELD ? (
              <FormMultiField
                errors={errors}
                multiField={screen}
                formValue={formValue}
              />
            ) : (
              <FormField
                autoFocus
                errors={errors}
                field={screen}
                formValue={formValue}
              />
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
                <Button
                  loading={loading || createPending}
                  disabled={loading || createPending}
                  htmlType="submit"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  loading={loading || createPending}
                  disabled={loading || createPending}
                  variant="text"
                  icon="arrowRight"
                  htmlType="submit"
                >
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
