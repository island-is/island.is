import React, { FC, useState, useReducer, useEffect } from 'react'
import { FileUploadField } from '@island.is/application/schema'
import {
  Box,
  InputFileUpload,
  UploadFile,
  fileToObject,
  Typography,
} from '@island.is/island-ui/core'
import { FieldBaseProps } from '../../../types'
import { useFormContext, Controller } from 'react-hook-form'
import { getValueViaPath } from '../../../utils'
import { useMutation } from '@apollo/client'

import { uploadFileToS3 } from './utils'
import { ActionTypes } from './types'

import {
  CREATE_UPLOAD_URL,
  ADD_ATTACHMENT,
  DELETE_ATTACHMENT,
} from '@island.is/application/graphql'

type UploadFileAnswer = {
  name: string
  key: string
  url: string
}

// Transform an uploaded file to an form answer.
const transformToAnswer = (f: UploadFile): UploadFileAnswer => {
  return { name: f.name, key: f.key, url: f.url }
}

// Transform an form answer to an uploaded file object to display.
const answerToUploadFile = (a: UploadFile): UploadFile => {
  return { name: a.name, key: a.key, url: a.url, status: 'done' }
}

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD:
      return state.concat(action.payload.newFiles)

    case ActionTypes.REMOVE:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )

    case ActionTypes.UPDATE:
      return state.map((file: UploadFile) => {
        if (file.name === action.payload.file.name) {
          file.status = action.payload.status
          file.percent = action.payload.percent
          file.key = action.payload.key
          file.url = action.payload.url
        }
        return file
      })

    default:
      return state
  }
}

interface Props extends FieldBaseProps {
  field: FileUploadField
}
const FileUploadFormField: FC<Props> = ({
  applicationId,
  error,
  field,
  formValue,
}) => {
  const { id, introduction } = field
  const { clearErrors, setValue } = useFormContext()
  const [uploadError, setUploadError] = useState<string | undefined>(undefined)
  const val = getValueViaPath(formValue, id, [])

  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)

  const [addAttachment] = useMutation(ADD_ATTACHMENT)

  const [deleteAttachment] = useMutation(DELETE_ATTACHMENT)

  const initialUploadFiles: UploadFile[] =
    (val && val.map((f) => answerToUploadFile(f))) || []

  const [state, dispatch] = useReducer(reducer, initialUploadFiles)

  useEffect(() => {
    const onlyUploadedFiles = state.filter(
      (f: UploadFile) => f.key && f.url && f.status === 'done',
    )

    const uploadAnswer: UploadFileAnswer[] = onlyUploadedFiles.map(
      transformToAnswer,
    )

    setValue(id, uploadAnswer)
  }, [state, id, setValue])

  const uploadFileFlow = async (file: UploadFile) => {
    // 1. Get the upload URL
    const { data } = await createUploadUrl({
      variables: {
        filename: file.name,
      },
    })

    // 2. Upload the file to S3
    const {
      createUploadUrl: { url, fields },
    } = data

    let response

    try {
      response = await uploadFileToS3(file, dispatch, url, fields)
    } catch (e) {
      error = e
      return Promise.reject(e)
    }

    // 3. Add Attachment Data
    await addAttachment({
      variables: {
        input: {
          id: applicationId,
          key: fields.key,
          url: `${response.url}/${fields.key}`,
        },
      },
    })

    // Done!
    return Promise.resolve({ url: response.url, key: fields.key })
  }

  const onFileChange = async (newFiles: File[]) => {
    const addedUniqueFiles = newFiles.filter((newFile: File) => {
      let isUnique = true
      state.forEach((uploadedFile: UploadFile) => {
        if (uploadedFile.name === newFile.name) isUnique = false
      })
      return isUnique
    })

    if (addedUniqueFiles.length === 0) return

    clearErrors(id)
    setUploadError(undefined)

    const newUploadFiles = addedUniqueFiles.map((f) =>
      fileToObject(f, 'uploading'),
    )

    // Add the files to the list so that the control presents them
    // with a spinner.
    dispatch({
      type: ActionTypes.ADD,
      payload: {
        newFiles: newUploadFiles,
      },
    })

    // Upload each file.
    newFiles.forEach(async (f: UploadFile) => {
      await uploadFileFlow(f)
        .then((answer) => {
          dispatch({
            type: ActionTypes.UPDATE,
            payload: {
              file: f,
              status: 'done',
              percent: 100,
              key: answer.key,
              url: answer.url,
            },
          })
        })
        .catch((e) => {
          setUploadError('An error occurred uploading one or more files')
        })
    })
  }

  const onRemoveFile = async (fileToRemove: UploadFile) => {
    // If it's previously been uploaded, remove it from the attachement
    if (fileToRemove.key) {
      await deleteAttachment({
        variables: {
          input: {
            id: applicationId,
            key: fileToRemove.key,
          },
        },
      })
    }

    dispatch({
      type: ActionTypes.REMOVE,
      payload: {
        fileToRemove,
      },
    })
  }

  return (
    <Box>
      <Typography variant="p">{introduction}</Typography>
      <Controller
        name={`${id}`}
        defaultValue={initialUploadFiles}
        render={() => {
          return (
            <Box paddingTop={2}>
              <InputFileUpload
                fileList={state}
                header="Drag documents here to upload"
                description="Documents accepted with extension: .pdf, .docx, .rtf"
                buttonLabel="Select documents to upload"
                onChange={onFileChange}
                onRemove={onRemoveFile}
                errorMessage={error || uploadError}
              />
            </Box>
          )
        }}
      />
    </Box>
  )
}

export default FileUploadFormField
