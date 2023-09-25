import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import {
  CaseFileState,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import SelectableList, {
  Item,
} from '@island.is/judicial-system-web/src/components/SelectableList/SelectableList'
import {
  CaseOrigin,
  PoliceCaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { policeCaseFiles as m } from './PoliceCaseFiles.strings'

export interface PoliceCaseFilesData {
  files: PoliceCaseFile[]
  isLoading: boolean
  hasError: boolean
  errorCode?: string
}

export interface PoliceCaseFileCheck extends PoliceCaseFile {
  checked: boolean
}

export const mapPoliceCaseFileToPoliceCaseFileCheck = (
  file: PoliceCaseFile,
): PoliceCaseFileCheck => ({
  id: file.id,
  name: file.name,
  policeCaseNumber: file.policeCaseNumber,
  chapter: file.chapter,
  displayDate: file.displayDate,
  checked: false,
})

interface Props {
  onUpload: (a: Item[]) => Promise<void>
  isUploading: boolean
  policeCaseFileList: PoliceCaseFileCheck[]
  setPoliceCaseFileList: React.Dispatch<
    React.SetStateAction<PoliceCaseFileCheck[]>
  >
  policeCaseFiles?: PoliceCaseFilesData
}

const PoliceCaseFiles: React.FC<React.PropsWithChildren<Props>> = ({
  onUpload,
  policeCaseFileList,
  policeCaseFiles,
}) => {
  const { formatMessage } = useIntl()
  const { workingCase } = useContext(FormContext)

  return (
    <Box marginBottom={5}>
      {workingCase.origin === CaseOrigin.LOKE && (
        <SelectableList
          items={policeCaseFileList
            .filter((policeCaseFile) => {
              const f = workingCase.caseFiles?.find(
                (caseFile) => caseFile.id === policeCaseFile.id,
              )

              if (f?.state === CaseFileState.STORED_IN_RVG) {
                return false
              }
              return true
            })
            .map((p) => ({
              id: p.id,
              name: p.name,
            }))}
          CTAButton={{
            onClick: onUpload,
            label: formatMessage(m.uploadButtonLabel),
          }}
          errorMessage={
            policeCaseFiles?.hasError
              ? formatMessage(m.couldNotGetFromLOKEMessage)
              : undefined
          }
          isLoading={policeCaseFiles?.isLoading}
          successMessage={formatMessage(m.allFilesUploadedMessage)}
          warningMessage={
            policeCaseFiles?.files.length === 0
              ? formatMessage(m.noFilesFoundInLOKEMessage)
              : undefined
          }
        />
      )}
      {workingCase.origin !== CaseOrigin.LOKE && (
        <AlertMessage
          type="info"
          title={formatMessage(m.originNotLokeTitle, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
          message={formatMessage(m.originNotLokeMessage, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
        ></AlertMessage>
      )}
    </Box>
  )
}

export default PoliceCaseFiles
