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

const blobToFile = (theBlob: Blob): File => {
  var file = new File([theBlob], 'name.jpg')
  return file
}

const FileUploadshi: FC<FileUploadProps> = () => {
  const [state, dispatch] = useReducer(reducer, initialUploadFiles)
  const [error, setError] = useState<string | undefined>(undefined)
  const [imageSrc, setImageSrc] = React.useState(undefined)
  const [croppedImage, setcroppedImage] = React.useState(undefined)

  const handleCrop = (image: Blob) => {
    setError(undefined)
    setcroppedImage(image)
    console.log('final image', image)
    console.log('blob to file', blobToFile(image))
    uploadFile(blobToFile(image), dispatch).catch((e) => {
      setError('An error occurred uploading one or more files')
    })
  }

  const onChange = (newFiles: File[]) => {
    const newUploadFiles = newFiles.map((f) => fileToObject(f))

    // Set the image that launches the cropper
    newFiles.forEach((file) => {
      console.log('file first', file)
      const reader = new FileReader()
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        setImageSrc(binaryStr)
      }
      reader.readAsDataURL(file)
    })
    // setError(undefined)
    // newUploadFiles.forEach((f: UploadFile) => {
    //   uploadFile(f, dispatch).catch((e) => {
    //     setError('An error occurred uploading one or more files')
    //   })
    // })

    // dispatch({
    //   type: ActionTypes.ADD,
    //   payload: {
    //     newFiles: newUploadFiles,
    //   },
    // })
  }

  const remove = (fileToRemove: UploadFile) => {
    // dispatch({
    //   type: ActionTypes.REMOVE,
    //   payload: {
    //     fileToRemove,
    //   },
    // })
  }

  return (
    <>
      {!imageSrc ? (
        <ContentBlock>
          <Box padding={[2, 2, 3]} background="blue100">
            <InputFileUpload
              fileList={state}
              header="Drag picture here to upload"
              description="Images accepted with extension: png, .jpg, .jpeg"
              buttonLabel="Select picture to upload"
              onChange={onChange}
              onRemove={remove}
              errorMessage={state.length > 0 ? error : undefined}
              accept={['.png', '.jpg', '.jpeg']}
            />
          </Box>
        </ContentBlock>
      ) : (
        <>
          <ImageCropper
            imageSrc={imageSrc}
            onCrop={handleCrop}
            onCancel={() => {
              setImageSrc(undefined)
            }}
          />
          <img src={croppedImage} />
        </>
      )}
    </>
  )
}

export default FileUploadshi
