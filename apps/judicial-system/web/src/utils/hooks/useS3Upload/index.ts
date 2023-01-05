import { useEffect, useMemo, useRef, useState } from 'react'
import { useMutation } from '@apollo/client'

import { UploadFile } from '@island.is/island-ui/core'
import { CreateFileMutation } from '@island.is/judicial-system-web/graphql'
import { Case } from '@island.is/judicial-system/types'

import { TUploadFile } from '../useS3UploadV2/useS3UploadV2'

export const useS3Upload = (workingCase: Case) => {
  const [files, setFiles] = useState<TUploadFile[]>([])
  const [allFilesUploaded, setAllFilesUploaded] = useState<boolean>(true)
  const filesRef = useRef<UploadFile[]>(files)

  useEffect(() => {
    const uploadCaseFiles = workingCase.caseFiles?.map((caseFile) => {
      const uploadCaseFile = caseFile as UploadFile
      uploadCaseFile.status = 'done'
      return uploadCaseFile
    })

    setFilesRefAndState(uploadCaseFiles ?? [])
  }, [workingCase.caseFiles])

  useMemo(() => {
    setAllFilesUploaded(
      files.filter((file) => file.status === 'done' || file.status === 'error')
        .length === files.length,
    )
  }, [files])

  const [createFileMutation] = useMutation(CreateFileMutation)

  // Utils
  /**
   * Sets ref and state value
   * @param files Files to set to state.
   */
  const setFilesRefAndState = (files: UploadFile[]) => {
    filesRef.current = files
    setFiles(files)
  }

  /**
   * Insert file in database and update state.
   * @param file The file to add to case.
   */
  const addFileToCase = async (
    file: TUploadFile,
    cb: (file: TUploadFile) => void,
  ) => {
    if (workingCase && file.size && file.key) {
      await createFileMutation({
        variables: {
          input: {
            caseId: workingCase.id,
            type: file.type,
            key: file.key,
            size: file.size,
            category: file.category,
            policeCaseNumber: file.policeCaseNumber,
          },
        },
      })
        .then((res) => {
          file.id = res.data.createFile.id
          file.status = 'done'
          cb(file)
        })
        .catch(() => {
          // TODO: handle error
        })
    }
  }

  return {
    allFilesUploaded,
    addFileToCase,
  }
}
