import React, { useContext } from 'react'
import { useIntl } from 'react-intl'

import { AlertMessage, Box, LoadingDots } from '@island.is/island-ui/core'
import { isIndictmentCase } from '@island.is/judicial-system/types'
import { FormContext } from '@island.is/judicial-system-web/src/components'
import SelectableList, {
  Item,
} from '@island.is/judicial-system-web/src/components/SelectableList/SelectableList'
import {
  CaseOrigin,
  PoliceCaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'

import PoliceCaseFilesMessageBox from '../PoliceCaseFilesMessageBox/PoliceCaseFilesMessageBox'
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
          items={policeCaseFileList.map((p) => ({
            id: p.id,
            name: p.name,
          }))}
          CTAButton={{
            onClick: onUpload,
            label: formatMessage(m.uploadButtonLabel),
          }}
        >
          {policeCaseFiles?.isLoading ? (
            <Box textAlign="center" paddingY={2} paddingX={3} marginBottom={2}>
              <LoadingDots />
            </Box>
          ) : policeCaseFiles?.hasError ? (
            <PoliceCaseFilesMessageBox
              icon="close"
              iconColor="red400"
              message={formatMessage(m.couldNotGetFromLOKEMessage)}
            />
          ) : policeCaseFiles?.files.length === 0 ? (
            <PoliceCaseFilesMessageBox
              icon="warning"
              iconColor="yellow400"
              message={formatMessage(m.noFilesFoundInLOKEMessage)}
            />
          ) : (
            <PoliceCaseFilesMessageBox
              icon="checkmark"
              iconColor="blue400"
              message={formatMessage(m.allFilesUploadedMessage)}
            />
          )}
        </SelectableList>
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
