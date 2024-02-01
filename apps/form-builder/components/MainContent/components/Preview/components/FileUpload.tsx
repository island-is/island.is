import {
  InputFileUpload,
  UploadFile,
  fileToObject,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { uuid } from 'uuidv4'
import * as fileTypes from '../../../../../lib/fileTypes.json'
import { IInput } from '../../../../../types/interfaces'

// enum ActionTypes {
//   add = 'add',
//   remove = 'remove',
//   update = 'update',
// }

type Props = {
  currentItem: IInput
}

export default function FileUpload({ currentItem }: Props) {
  const [error, setError] = useState<string | undefined>(undefined)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])

  // const uploadFile = async (file: UploadFile, response) => {
  //   return new Promise((resolve, reject) => {
  //     const request = new XMLHttpRequest()
  //     // request.withCredentials = true
  //     // request.responseType = 'json'

  //     request.upload.addEventListener('progress', (event) => {
  //       if (event.lengthComputable) {
  //         file.percent = (event.loaded / event.total) * 100
  //         file.status = 'uploading'

  //         const withoutThisFile = fileList.filter((f) => f.key !== file.key)
  //         const newFileList = [...withoutThisFile, file]
  //         setFileList(newFileList)
  //       }
  //     })

  //     request.upload.addEventListener('error', () => {
  //       file.percent = 0
  //       file.status = 'error'

  //       const withoutThisFile = fileList.filter((f) => f.key !== file.key)
  //       const newFileList = [...withoutThisFile, file]
  //       setFileList(newFileList)
  //       reject()
  //     })
  //     request.open('POST', response.url)

  //     const formData = new FormData()

  //     Object.keys(response.fields).forEach((key) =>
  //       formData.append(key, response.fields[key]),
  //     )
  //     formData.append('file', file.originalFileObj as File)

  //     request.setRequestHeader('x-amz-acl', 'bucket-owner-full-control')

  //     request.onload = () => {
  //       resolve(request.response)
  //     }

  //     request.onerror = () => {
  //       reject()
  //     }
  //     request.send(formData)
  //   })
  // }

  const onChange = (files: File[]) => {
    const uploadFiles = files.map((file) => fileToObject(file))
    const uploadFilesWithKey = uploadFiles.map((f) => ({
      ...f,
      key: uuid(),
    }))

    // Check whether upload will exceed limit and if so, prevent it
    if (
      fileList.length + uploadFilesWithKey.length >
      currentItem.inputSettings.fjoldi
    ) {
      setError(`Hámarksfjöldi skjala er ${currentItem.inputSettings.fjoldi}`)
      return
    }
    setError('')
    const newFileList = [...fileList, ...uploadFilesWithKey]
    setFileList(newFileList)
  }

  const onRemove = (fileToRemove: UploadFile) => {
    const newFileList = fileList.filter((file) => file.key !== fileToRemove.key)
    setFileList(newFileList)
  }

  return (
    <>
      <InputFileUpload
        name="fileUpload"
        fileList={fileList}
        header={currentItem.name.is}
        description={`Eftirfarandi skjalatýpur eru leyfðar: ${currentItem.inputSettings.tegundir?.map(
          (f) => `${f} `,
        )}`}
        buttonLabel="Veldu skjöl til að hlaða upp"
        onChange={onChange}
        onRemove={onRemove}
        errorMessage={fileList.length > 0 ? error : undefined}
        accept={currentItem.inputSettings.tegundir.map((t) => fileTypes[t])}
        showFileSize
        maxSize={currentItem.inputSettings.hamarksstaerd}
        multiple={currentItem.inputSettings.erFjolval}
      />
    </>
  )
}
