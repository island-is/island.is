import React from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'framer-motion'

import { Box, AccordionItem, Button } from '@island.is/island-ui/core'
import { UploadState } from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import { useCourtUpload } from '@island.is/judicial-system-web/src/utils/hooks/useCourtUpload'
import {
  Case,
  CaseState,
  completedCaseStates,
  courtRoles,
  User,
  UserRole,
} from '@island.is/judicial-system/types'
import { caseFilesAccordion as m } from '@island.is/judicial-system-web/messages'

import { CaseFileList, InfoBox } from '../..'
import { UploadStateMessage } from './UploadStateMessage'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
  user: User
}

const CaseFilesAccordionItem: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase, user } = props

  const { formatMessage } = useIntl()
  const { uploadFilesToCourt, uploadState } = useCourtUpload(
    workingCase,
    setWorkingCase,
  )

  const canCaseFilesBeOpened = () => {
    const isAppealGracePeriodExpired = workingCase.isAppealGracePeriodExpired

    const canProsecutorOpen =
      user.role === UserRole.PROSECUTOR &&
      user.institution?.id === workingCase.creatingProsecutor?.institution?.id

    const canCourtRoleOpen =
      courtRoles.includes(user.role) &&
      [
        CaseState.SUBMITTED,
        CaseState.RECEIVED,
        ...completedCaseStates,
      ].includes(workingCase.state)

    return (
      !isAppealGracePeriodExpired && (canProsecutorOpen || canCourtRoleOpen)
    )
  }

  const canCaseFilesBeUploaded = () => {
    const isAppealGracePeriodExpired = workingCase.isAppealGracePeriodExpired

    const canCourtRoleUpload =
      courtRoles.includes(user.role) &&
      [CaseState.RECEIVED, ...completedCaseStates].includes(workingCase.state)

    return !isAppealGracePeriodExpired && canCourtRoleUpload
  }

  return (
    <AccordionItem
      id="caseFilesAccordionItem"
      label={
        <Box display="flex" alignItems="center" overflow="hidden">
          {`Rannsóknargögn (${
            workingCase.caseFiles ? workingCase.caseFiles.length : 0
          })`}

          {canCaseFilesBeUploaded() && (
            <AnimatePresence>
              {uploadState === UploadState.UPLOAD_ERROR && (
                <UploadStateMessage
                  icon="warning"
                  iconColor="red600"
                  message={formatMessage(m.someFilesUploadedToCourtText)}
                />
              )}
              {uploadState === UploadState.ALL_UPLOADED && (
                <UploadStateMessage
                  icon="checkmark"
                  iconColor="blue400"
                  message={formatMessage(m.allFilesUploadedToCourtText)}
                />
              )}
            </AnimatePresence>
          )}
        </Box>
      }
      labelVariant="h3"
      labelUse="h3"
    >
      <CaseFileList
        caseId={workingCase.id}
        files={workingCase.caseFiles ?? []}
        canOpenFiles={canCaseFilesBeOpened()}
        hideIcons={user?.role === UserRole.PROSECUTOR}
        handleRetryClick={(id: string) =>
          workingCase.caseFiles &&
          uploadFilesToCourt([
            workingCase.caseFiles[
              workingCase.caseFiles.findIndex((file) => file.id === id)
            ],
          ])
        }
        isCaseCompleted={completedCaseStates.includes(workingCase.state)}
      />
      {canCaseFilesBeUploaded() && (
        <Box display="flex" justifyContent="flexEnd">
          {(workingCase.caseFiles || []).length === 0 ? null : uploadState ===
            UploadState.NONE_CAN_BE_UPLOADED ? (
            <InfoBox text={formatMessage(m.uploadToCourtAllBrokenText)} />
          ) : (
            <Button
              size="small"
              onClick={() => uploadFilesToCourt(workingCase.caseFiles)}
              loading={uploadState === UploadState.UPLOADING}
              disabled={
                uploadState === UploadState.UPLOADING ||
                uploadState === UploadState.ALL_UPLOADED
              }
            >
              {formatMessage(
                uploadState === UploadState.UPLOAD_ERROR
                  ? m.retryUploadToCourtButtonText
                  : m.uploadToCourtButtonText,
              )}
            </Button>
          )}
        </Box>
      )}
    </AccordionItem>
  )
}

export default CaseFilesAccordionItem
