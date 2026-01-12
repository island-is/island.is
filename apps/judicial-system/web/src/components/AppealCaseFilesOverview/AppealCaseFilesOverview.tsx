import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import router from 'next/router'

import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import * as constants from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCompletedCase,
  isCourtOfAppealsUser,
  isDefenceUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  ContextMenu,
  FileNotFoundModal,
  FormContext,
  IconButton,
  PdfButton,
  SectionHeading,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  CaseAppealState,
  CaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'

import { strings } from './AppealCaseFilesOverview.strings'
import * as styles from './AppealCaseFilesOverview.css'

const AppealCaseFilesOverview = () => {
  const { workingCase } = useContext(FormContext)

  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })
  const { handleRemove } = useS3Upload(workingCase.id)

  const { formatMessage } = useIntl()
  const { user, limitedAccess } = useContext(UserContext)
  const [allFiles, setAllFiles] = useState<CaseFile[]>([])

  useEffect(() => {
    if (workingCase.caseFiles) {
      setAllFiles(
        workingCase.caseFiles.filter((caseFile) => {
          return (
            caseFile.category &&
            ((workingCase.prosecutorPostponedAppealDate &&
              [
                CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
                CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
              ].includes(caseFile.category)) ||
              (workingCase.prosecutorStatementDate &&
                [
                  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
                  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
                ].includes(caseFile.category)) ||
              (workingCase.accusedPostponedAppealDate &&
                [
                  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
                  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
                ].includes(caseFile.category)) ||
              (workingCase.defendantStatementDate &&
                [
                  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
                  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
                ].includes(caseFile.category)) ||
              [
                CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
                CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
              ].includes(caseFile.category) ||
              ((workingCase.appealState === CaseAppealState.COMPLETED ||
                isCourtOfAppealsUser(user)) &&
                caseFile.category === CaseFileCategory.APPEAL_RULING) ||
              (((workingCase.appealState === CaseAppealState.COMPLETED &&
                isDefenceUser(user)) ||
                isCourtOfAppealsUser(user)) &&
                caseFile.category === CaseFileCategory.APPEAL_COURT_RECORD))
          )
        }),
      )
    }
  }, [
    user,
    workingCase.accusedPostponedAppealDate,
    workingCase.appealState,
    workingCase.caseFiles,
    workingCase.defendantStatementDate,
    workingCase.prosecutorPostponedAppealDate,
    workingCase.prosecutorStatementDate,
  ])

  return (
    isCompletedCase(workingCase.state) &&
    allFiles &&
    allFiles.length > 0 && (
      <>
        <Box marginBottom={[2, 5]}>
          <SectionHeading
            title="Skjöl kærumáls"
            tooltip={
              isProsecutionUser(user)
                ? 'Verjandi sér einungis kæru og greinargerð.'
                : undefined
            }
          />
          {allFiles.map((file) => {
            const prosecutorSubmitted = file.category?.includes('PROSECUTOR')
            const isDisabled = !file.isKeyAccessible
            const canDeleteFile =
              file.category &&
              [
                CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
                CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
                CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
                CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
                CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
                CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
              ].includes(file.category) &&
              ((prosecutorSubmitted && isProsecutionUser(user)) ||
                (!prosecutorSubmitted && isDefenceUser(user)))

            return (
              <PdfButton
                key={file.id}
                renderAs="row"
                title={file.name}
                disabled={isDisabled}
                handleClick={() => onOpen(file.id)}
              >
                <Box
                  display="flex"
                  alignItems={['flexEnd', 'flexEnd', 'center']}
                  justifyContent={['spaceBetween', 'spaceBetween', 'center']}
                >
                  <Box className={styles.childContainer}>
                    <Text whiteSpace="nowrap">
                      {`${formatDate(file.created, 'dd.MM.y')} kl. ${formatDate(
                        file.created,
                        constants.TIME_FORMAT,
                      )}`}
                    </Text>
                    {file.category &&
                      ![
                        CaseFileCategory.APPEAL_RULING,
                        CaseFileCategory.APPEAL_COURT_RECORD,
                      ].includes(file.category) && (
                        <Text variant="small">
                          {formatMessage(strings.submittedBy, {
                            filesCategory: prosecutorSubmitted,
                          })}
                        </Text>
                      )}
                  </Box>
                  <Box marginLeft={3}>
                    <ContextMenu
                      items={[
                        {
                          title: 'Opna',
                          onClick: () => onOpen(file.id),
                          icon: 'open' as IconMapIcon,
                        },
                        ...(canDeleteFile
                          ? [
                              {
                                title: 'Eyða',
                                onClick: () =>
                                  handleRemove(file as TUploadFile, () => {
                                    setAllFiles((prev) =>
                                      prev.filter((f) => f.id !== file.id),
                                    )
                                  }),
                                icon: 'trash' as IconMapIcon,
                              },
                            ]
                          : []),
                      ]}
                      render={
                        <IconButton
                          icon="ellipsisVertical"
                          colorScheme="transparent"
                          onClick={(evt) => {
                            evt.stopPropagation()
                          }}
                          disabled={isDisabled}
                        />
                      }
                    />
                  </Box>
                </Box>
              </PdfButton>
            )
          })}
        </Box>
        {(isProsecutionUser(user) || isDefenceUser(user)) &&
          workingCase.appealState &&
          workingCase.appealState !== CaseAppealState.COMPLETED && (
            <Box display="flex" justifyContent="flexEnd" marginTop={3}>
              <Button
                icon="add"
                onClick={() => {
                  router.push(
                    limitedAccess
                      ? `${constants.DEFENDER_APPEAL_FILES_ROUTE}/${workingCase.id}`
                      : `${constants.APPEAL_FILES_ROUTE}/${workingCase.id}`,
                  )
                }}
                disabled={workingCase.appealState === CaseAppealState.WITHDRAWN}
              >
                {formatMessage(strings.addFiles)}
              </Button>
            </Box>
          )}
        <AnimatePresence>
          {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
        </AnimatePresence>
      </>
    )
  )
}

export default AppealCaseFilesOverview
