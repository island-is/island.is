import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import SelectableList, {
  Item,
} from '@island.is/judicial-system-web/src/components/SelectableList/SelectableList'
import {
  CaseOrigin,
  PoliceCaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { strings } from './PoliceCaseFiles.strings'

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
  onUpload: (selectedFiles: Item[]) => Promise<void>
  policeCaseFileList?: PoliceCaseFileCheck[]
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
          items={policeCaseFileList?.map((p) => ({
            id: p.id,
            name: p.name,
          }))}
          CTAButton={{
            onClick: onUpload,
            label: formatMessage(strings.uploadButtonLabel),
          }}
          errorMessage={
            policeCaseFiles?.hasError
              ? formatMessage(strings.couldNotGetFromLOKEMessage)
              : undefined
          }
          isLoading={
            policeCaseFiles?.isLoading === undefined
              ? true
              : policeCaseFiles?.isLoading
          }
          successMessage={
            policeCaseFileList?.length === 0
              ? formatMessage(strings.allFilesUploadedMessage)
              : undefined
          }
          warningMessage={
            policeCaseFiles?.files.length === 0
              ? formatMessage(strings.noFilesFoundInLOKEMessage)
              : undefined
          }
        />
      )}
      {workingCase.origin !== CaseOrigin.LOKE && (
        <AlertMessage
          type="info"
          title={formatMessage(strings.originNotLokeTitle, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
          message={formatMessage(strings.originNotLokeMessage, {
            isIndictmentCase: isIndictmentCase(workingCase.type),
          })}
        ></AlertMessage>
      )}
    </Box>
  )
}

export default PoliceCaseFiles
