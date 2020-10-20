import React, { FC, useReducer, useRef, useState, useCallback } from 'react'

import {
  Box,
  ContentBlock,
  InputFileUpload,
  fileToObject,
  UploadFile,
} from '@island.is/island-ui/core'

import { uploadFileToS3 } from './FileUploadUtils'
import { useMutation } from '@apollo/client'
import ImageCropper from './ImageCropper'
import { CREATE_UPLOAD_URL } from '@island.is/application/graphql'
enum ActionTypes {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
  UPDATE = 'UPDATE',
}

type Action = {
  type: ActionTypes
  payload: any
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
      return state
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
  const [createUploadUrl] = useMutation(CREATE_UPLOAD_URL)

  const uploadFileFlow = async (file: UploadFile) => {
    try {
      const { data } = await createUploadUrl({
        variables: {
          filename: file.name,
        },
      })

      const {
        createUploadUrl: { url, fields },
      } = data

      const response = await uploadFileToS3(file, dispatch, url, fields)

      return Promise.resolve({ url: response.url, key: fields.key })
    } catch (e) {
      error = e
      return Promise.reject(e)
    }
  }

  function dataURItoBlob(dataURI: string) {
    var byteString = atob(dataURI.split(',')[1])
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    var ab = new ArrayBuffer(byteString.length)
    var ia = new Uint8Array(ab)
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    var blob = new Blob([ab], { type: mimeString })
    return blob
  }

  const handleCrop = (imageDataUri: string) => {
    setError(undefined)
    var blobData = dataURItoBlob(imageDataUri)
    uploadFileFlow(fileToObject(blobToFile(blobData)))
  }

  const onChange = (newFiles: File[]) => {
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
              onRemove={() => {
                setImageSrc(undefined)
              }}
              errorMessage={error}
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
        </>
      )}
    </>
  )
}

export default FileUploadshi
