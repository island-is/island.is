import {
  InputFileUpload,
  UploadFile,
  fileToObject,
} from '@island.is/island-ui/core'
import { useState } from 'react'
import { uuid } from 'uuidv4'
import * as fileTypes from '../../../../../lib/fileTypes.json'
import { IInput } from '../../../../../types/interfaces'

type Props = {
  currentItem: IInput
}

export default function FileUpload({ currentItem }: Props) {
  const [error, setError] = useState<string | undefined>(undefined)
  const [fileList, setFileList] = useState<Array<UploadFile>>([])

  const onChange = (files: File[]) => {
    const uploadFiles = files.map((file) => fileToObject(file))
    const uploadFilesWithKey = uploadFiles.map((f) => ({
      ...f,
      key: uuid(),
    }))

    // Check whether upload will exceed limit and if so, prevent it
    const currentAmount = currentItem.inputSettings.fjoldi ?? 0
    if (fileList.length + uploadFilesWithKey.length > currentAmount) {
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
        accept={
          currentItem.inputSettings.tegundir?.map(
            (t) => fileTypes[t as keyof typeof fileTypes],
          ) ?? []
        }
        showFileSize
        maxSize={currentItem.inputSettings.hamarksstaerd}
        multiple={currentItem.inputSettings.erFjolval}
      />
    </>
  )
}
