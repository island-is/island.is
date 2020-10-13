import React, { FC, useReducer, useRef, useState, useCallback } from 'react'

import {
  Button,
  Box,
  ContentBlock,
  Typography,
  Stack,
  Icon,
  GridContainer,
  GridRow,
  GridColumn,
  InputFileUpload,
  fileToObject,
  UploadFile,
  Inline,
} from '@island.is/island-ui/core'

import { type } from 'os'
import { background } from 'libs/island-ui/core/src/lib/Box/useBoxStyles.treat'
import ImageCropper from './ImageCropper'

enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

type Action = {
  type: ActionTypes
  payload: any
}

const uploadFile = (file: UploadFile, dispatch: (action: Action) => void) => {
  return new Promise((resolve, reject) => {
    const req = new XMLHttpRequest()

    req.upload.addEventListener('progress', (event) => {
      console.log('progress', event)
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100)

        dispatch({
          type: ActionTypes.UPDATE,
          payload: { file, status: 'uploading', percent },
        })
      }
    })

    req.upload.addEventListener('load', (event) => {
      console.log('load', event)
      dispatch({
        type: ActionTypes.UPDATE,
        payload: { file, status: 'done', percent: 100 },
      })
      resolve(req.response)
    })

    req.upload.addEventListener('error', (event) => {
      console.log('error', event)
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

const initialUploadFiles: UploadFile[] = []

function reducer(state: UploadFile[], action: Action) {
  switch (action.type) {
    case ActionTypes.ADD:
      return state.concat(action.payload.newFiles)

    case ActionTypes.REMOVE:
      return state.filter(
        (file) => file.name !== action.payload.fileToRemove.name,
      )

    case ActionTypes.UPDATE:
      return [
        ...state.map((file: UploadFile) => {
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

interface FileUploadProps {
  show?: boolean
}

const FileUploadshi: FC<FileUploadProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialUploadFiles)
  const [error, setError] = useState<string | undefined>(undefined)
  const [imageSrc, setImageSrc] = React.useState(null)
  const reader = new FileReader()

  const onChange = (newFiles: File[]) => {
    const newUploadFiles = newFiles.map((f) => fileToObject(f))
    // the picture i need
    // console.log(newFiles)
    // console.log(newFiles[0].name)
    // console.log(typeof newFiles[0])
    // console.log(newUploadFiles[0].originalFileObj)
    const reader = new FileReader()
    newFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result
        setImageSrc(binaryStr)
      }
      reader.readAsDataURL(file)
    })

    // setImageSrc(newUploadFiles[0].originalFileObj.blob)

    // invoke cropper and hide the document uploader

    // close the cropper shows the file upload again

    // accept the cropper picture and upload

    setError(undefined)
    // as soon as we get the first picture hide the modal and open the cropper
    // when the scrapper finishes with the picture we need to call the uploader as usual
    // without showing the upload file functionality

    newUploadFiles.forEach((f: UploadFile) => {
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

  const remove = (fileToRemove: UploadFile) => {
    dispatch({
      type: ActionTypes.REMOVE,
      payload: {
        fileToRemove,
      },
    })
  }

  return (
    <>
      <ContentBlock>
        <Box padding={[2, 2, 3]} background="blue100">
          <InputFileUpload
            fileList={state}
            header="Drag picture here to upload"
            description="Documents accepted with extension: .pdf, .docx, .rtf"
            buttonLabel="Select documents to upload"
            onChange={onChange}
            onRemove={remove}
            errorMessage={state.length > 0 ? error : undefined}
            accept={['.png', '.jpg', '.jpeg']}
          />
        </Box>
      </ContentBlock>
      <ImageCropper imageSrc={imageSrc} />
    </>
  )
}

export default FileUploadshi
