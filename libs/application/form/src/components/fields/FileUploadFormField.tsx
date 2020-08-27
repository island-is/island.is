import React, { FC, useState, useReducer, useEffect } from 'react'
import { FileUploadField } from '@island.is/application/schema'
import { Box, InputFileUpload, Typography } from '@island.is/island-ui/core'
import { FieldBaseProps } from '../../types'
import { useFormContext, Controller } from 'react-hook-form'
import { UploadFile } from 'libs/island-ui/core/src/lib/InputFileUpload/InputFileUpload.types'
import { fileToObject } from 'libs/island-ui/core/src/lib/InputFileUpload/InputFileUpload.utils'
import { getValueViaPath } from '../../utils'
import { gql, useMutation } from '@apollo/client'

const SINGLE_UPLOAD_MUTATION = gql`
  mutation singleUpload($file: Upload!) {
    singleUpload(file: $file) {
      id
      url
    }
  }
`

type UploadFileAnswer = Pick<UploadFile, 'name' | 'url'>

// Transform a file object to a simple object that's stored
// as an answer.
const transformToAnswer = (f: UploadFileAnswer) => {
  return { name: f.name, url: f.url }
}

enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD:
      const updatedFiles = state.concat(action.payload.newFiles)
      return updatedFiles
    case ActionTypes.REMOVE:
      const updatedFileList = state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )
      return updatedFileList
    case ActionTypes.UPDATE:
      const updatedStatusList = state.map((file: UploadFile) => {
        if (file.name == action.payload.file.name) {
          file.status = action.payload.status
          file.percent = action.payload.percent
        }
        return file
      })
      return updatedStatusList
    default:
      throw new Error()
  }
}

interface Props extends FieldBaseProps {
  field: FileUploadField
}
const FileUploadFormField: FC<Props> = ({ error, field, formValue }) => {
  const { id, introduction } = field
  const { clearErrors, setValue } = useFormContext()
  const [uploadError, setUploadError] = useState<string | undefined>(undefined)
  const val = getValueViaPath(formValue, id, [])
  const [uploadFileMutation] = useMutation(SINGLE_UPLOAD_MUTATION)

  // If there were previously uploaded files set their status to 'done'. For example
  // if they re-loaded the form or came back to this question).
  const initialUploadFiles: UploadFile[] =
    (val && val.map((f) => fileToObject(f, 'done'))) || []

  const [state, dispatch] = useReducer(reducer, initialUploadFiles)

  useEffect(() => {
    const uploadAnswer: UploadFileAnswer[] = state.map(transformToAnswer)

    setValue(id, uploadAnswer)
  }, [state])

  return (
    <Box>
      <Typography variant="p">{introduction}</Typography>
      <Controller
        name={`${id}`}
        defaultValue={initialUploadFiles}
        render={({ onChange }) => {
          const onFileChange = async (newFiles: File[]) => {
            clearErrors(id)
            setUploadError(undefined)

            const newUploadFiles = newFiles.map((f) =>
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
            // Note: Do we want to use a multipleUpload mutation, or
            // loop with a single upload mutation?
            // https://github.com/jaydenseric/apollo-upload-examples/blob/master/app/components/UploadFileList.js
            // https://github.com/jaydenseric/apollo-upload-examples/blob/master/app/components/UploadFile.js
            newFiles.forEach((f: UploadFile) => {
              uploadFileMutation({
                variables: { file: f.originalFileObj },
              })
                .then(() => {
                  dispatch({
                    type: ActionTypes.UPDATE,
                    payload: {
                      payload: { f, status: 'done', percent: 100 },
                    },
                  })
                })
                .catch((e) => {
                  setUploadError(
                    'An error occurred uploading one or more files',
                  )
                })
            })
          }

          const onRemoveFile = (fileToRemove: UploadFile) => {
            // TODO: Remove the uploaded files from the server?

            dispatch({
              type: ActionTypes.REMOVE,
              payload: {
                fileToRemove,
                onChange,
              },
            })
          }

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
