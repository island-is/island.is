import { ApolloError, useMutation } from '@apollo/client'
import { UploadFileToCourtMutation } from '@island.is/judicial-system-web/graphql'
import {
  Case,
  CaseFile as TCaseFile,
  CaseFileState,
} from '@island.is/judicial-system/types'
import { useCallback, useEffect, useState } from 'react'

export type CaseFileStatus =
  | 'not-uploaded'
  | 'broken'
  | 'done'
  | 'error'
  | 'uploading'
  | 'unsupported'

export interface CaseFile extends TCaseFile {
  status: CaseFileStatus
}

export enum UploadState {
  ALL_UPLOADED = 'ALL_UPLOADED',
  NONE_CAN_BE_UPLOADED = 'NONE_CAN_BE_UPLOADED',
  NONE_UPLOADED = 'NONE_UPLOADED',
  SOME_NOT_UPLOADED = 'SOME_NOT_UPLOADED',
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  UPLOADING = 'UPLOADING',
}

export const useCourtUpload = (
  workingCase: Case,
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>,
) => {
  const [uploadState, setUploadState] = useState<UploadState>()
  const [uploadFileToCourtMutation] = useMutation(UploadFileToCourtMutation)

  const setFileUploadStatus = useCallback(
    (theCase: Case, file: CaseFile, status: CaseFileStatus) => {
      const files = theCase.caseFiles as CaseFile[]

      if (files) {
        const fileIndexToUpdate = files.findIndex((f) => f.id === file.id)
        files[fileIndexToUpdate] = {
          ...file,
          status,
        }

        setWorkingCase({ ...theCase })
      }
    },
    [setWorkingCase],
  )

  useEffect(() => {
    const files = workingCase.caseFiles as CaseFile[]

    files
      ?.filter((file) => file.status !== 'error' && file.status !== 'uploading')
      .forEach((file) => {
        if (
          file.state === CaseFileState.STORED_IN_COURT &&
          file.status !== 'done'
        ) {
          setFileUploadStatus(workingCase, file, 'done')
        }

        if (
          file.state === CaseFileState.STORED_IN_RVG &&
          file.key &&
          file.status !== 'not-uploaded'
        ) {
          setFileUploadStatus(workingCase, file, 'not-uploaded')
        }

        if (
          file.state === CaseFileState.STORED_IN_RVG &&
          !file.key &&
          file.status !== 'broken'
        ) {
          setFileUploadStatus(workingCase, file, 'broken')
        }
      })

    setUploadState(
      files?.some((file) => file.status === 'uploading')
        ? UploadState.UPLOADING
        : files?.some((file) => file.status === 'error')
        ? UploadState.UPLOAD_ERROR
        : files?.every((file) => file.status === 'broken')
        ? UploadState.NONE_CAN_BE_UPLOADED
        : files?.every(
            (file) => file.status === 'done' || file.status === 'broken',
          )
        ? UploadState.ALL_UPLOADED
        : files?.every(
            (file) =>
              file.status === 'not-uploaded' || file.status === 'broken',
          )
        ? UploadState.NONE_UPLOADED
        : UploadState.SOME_NOT_UPLOADED,
    )
  }, [setFileUploadStatus, workingCase])

  const uploadFilesToCourt = async (files?: TCaseFile[]) => {
    if (files) {
      const xFiles = files as CaseFile[]
      xFiles.forEach(async (file) => {
        try {
          if (file.state === CaseFileState.STORED_IN_RVG && file.key) {
            setFileUploadStatus(workingCase, file, 'uploading')

            await uploadFileToCourtMutation({
              variables: {
                input: {
                  id: file.id,
                  caseId: workingCase.id,
                },
              },
            })

            setFileUploadStatus(
              workingCase,
              { ...file, state: CaseFileState.STORED_IN_COURT },
              'done',
            )
          }
        } catch (error) {
          if (
            error instanceof ApolloError &&
            (error as ApolloError).graphQLErrors[0].extensions?.code ===
              'https://httpstatuses.com/404'
          ) {
            setFileUploadStatus(
              workingCase,
              { ...file, key: undefined },
              'broken',
            )
          } else if (
            error instanceof ApolloError &&
            (error as ApolloError).graphQLErrors[0].extensions?.code ===
              'https:/httpstatuses.com/415' // Unsupported Media Type
          ) {
            setFileUploadStatus(
              workingCase,
              { ...file, key: undefined },
              'unsupported',
            )
          } else {
            setFileUploadStatus(workingCase, file, 'error')
          }
        }
      })
    }
  }

  return {
    uploadFilesToCourt,
    uploadState,
  }
}
