import React, { useState } from 'react'

import { withFigma } from '../../utils/withFigma'
import {
  InputFileUploadDeprecated,
  fileToObjectDeprecated,
  UploadFileDeprecated,
} from './InputFileUploadDeprecated'
import { Box } from '../Box/Box'
import { ContentBlock } from '../ContentBlock/ContentBlock'

export default {
  title: 'Form/InputFileUpload',
  component: InputFileUploadDeprecated,
  parameters: withFigma('InputFileUpload'),
}

enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

type Action = {
  type: ActionTypes
  payload: any
}

const uploadFile = (
  file: UploadFileDeprecated,
  dispatch: (action: Action) => void,
) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    req.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)

        dispatch({
          type: ActionTypes.UPDATE,
          payload: { file, status: 'uploading', percent },
        })
      }
    })

    req.upload.addEventListener('load', (event) => {
      dispatch({
        type: ActionTypes.UPDATE,
        payload: { file, status: 'done', percent: 100 },
      })
      resolve(req.response)
    })

    req.upload.addEventListener('error', (event) => {
      dispatch({
        type: ActionTypes.UPDATE,
        payload: { file, status: 'error', percent: 0 },
      })
      reject(req.response)
    })

    const formData = new FormData()
    formData.append('file', file.originalFileObj || '', file.name)

    req.open('POST', 'http://localhost:5000/')
    req.send(formData)
  })
}

const initialUploadFiles: UploadFileDeprecated[] = []

function reducer(state: UploadFileDeprecated[], action: Action) {
  switch (action.type) {
    case ActionTypes.ADD:
      return state.concat(action.payload.newFiles)

    case ActionTypes.REMOVE:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )

    case ActionTypes.UPDATE:
      return [
        ...state.map((file: UploadFileDeprecated) => {
          if (file.name === action.payload.file.name) {
            file.status = action.payload.status
            file.percent = action.payload.percent
          }
          return file
        }),
      ]

    default:
      throw new Error()
  }
}

export const Default = () => {
  const [state, dispatch] = React.useReducer(reducer, initialUploadFiles)
  const [error, setError] = useState<string | undefined>(undefined)

  const onChange = (newFiles: File[]) => {
    const newUploadFiles = newFiles.map((f) => fileToObjectDeprecated(f))

    setError(undefined)

    newUploadFiles.forEach((f: UploadFileDeprecated) => {
      uploadFile(f, dispatch).catch((e) => {
        setError('An error occurred uploading one or more files')
      })
    })

    dispatch({
      type: ActionTypes.ADD,
      payload: {
        newFiles: newUploadFiles,
      },
    })
  }

  const remove = (fileToRemove: UploadFileDeprecated) => {
    dispatch({
      type: ActionTypes.REMOVE,
      payload: {
        fileToRemove,
      },
    })
  }

  return (
    <ContentBlock>
      <Box padding={[2, 2, 3]} background="blue100">
        <InputFileUploadDeprecated
          fileList={state}
          header="Drag documents here to upload"
          description="Documents accepted with extension: .pdf, .docx, .rtf"
          buttonLabel="Select documents to upload"
          onChange={onChange}
          onRemove={remove}
          errorMessage={state.length > 0 ? error : undefined}
        />
      </Box>
    </ContentBlock>
  )
}

export const Disabled = () => {
  return (
    <ContentBlock>
      <Box padding={[2, 2, 3]} background="blue100">
        <InputFileUploadDeprecated
          fileList={[]}
          header="Drag documents here to upload"
          description="Documents accepted with extension: .pdf, .docx, .rtf"
          buttonLabel="Select documents to upload"
          onChange={() => {
            // Intentionally left empty
          }}
          onRemove={() => {
            // Intentionally left empty
          }}
          disabled
        />
      </Box>
    </ContentBlock>
  )
}
