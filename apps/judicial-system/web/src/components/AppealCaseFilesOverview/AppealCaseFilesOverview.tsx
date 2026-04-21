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
  isIndictmentCase,
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
  AppealCaseState,
  Case,
  CaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useFileList,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isUserCaseFile } from '@island.is/judicial-system-web/src/utils/utils'

import { strings } from './AppealCaseFilesOverview.strings'
import { grid } from '../../utils/styles/recipes.css'
import * as styles from './AppealCaseFilesOverview.css'

const isProsecutorCategory = (category: CaseFileCategory | undefined | null) =>
  category &&
  [
    CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
    CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
    CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
  ].includes(category)

const isDefenceCategory = (category: CaseFileCategory | undefined | null) =>
  category &&
  [
    CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
    CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
  ].includes(category)

const getFileSubmittedByText = (file: CaseFile, workingCase: Case): string => {
  const prosecutorSubmitted = isProsecutorCategory(file.category)

  if (prosecutorSubmitted) {
    return 'Sækjandi lagði fram'
  }

  // For indictment cases, try to resolve the defender/spokesperson name
  if (isIndictmentCase(workingCase.type) && file.defendantId) {
    const defendant = workingCase.defendants?.find(
      (d) => d.id === file.defendantId,
    )

    if (defendant?.defenderName) {
      return `Verjandi ${defendant.defenderName} lagði fram`
    }
  }

  // Fallback: use submittedBy if available (covers civil claimant
  // spokespersons and other defence users)
  if (isIndictmentCase(workingCase.type) && file.civilClaimantId) {
    const civilClaimant = workingCase.civilClaimants?.find(
      (d) => d.id === file.civilClaimantId,
    )

    if (civilClaimant?.spokespersonName) {
      return `${
        civilClaimant.spokespersonIsLawyer ? 'Lögmaður' : 'Réttargæslumaður'
      } ${civilClaimant.spokespersonName} lagði fram`
    }
  }

  return 'Varnaraðili lagði fram'
}

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
              (workingCase.appealCase?.prosecutorStatementDate &&
                [
                  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
                  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
                ].includes(caseFile.category)) ||
              (workingCase.accusedPostponedAppealDate &&
                [
                  CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
                  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
                ].includes(caseFile.category)) ||
              (workingCase.appealCase?.defendantStatementDate &&
                [
                  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
                  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
                ].includes(caseFile.category)) ||
              [
                CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
                CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
              ].includes(caseFile.category) ||
              ((workingCase.appealCase?.appealState ===
                AppealCaseState.COMPLETED ||
                isCourtOfAppealsUser(user)) &&
                caseFile.category === CaseFileCategory.APPEAL_RULING) ||
              (((workingCase.appealCase?.appealState ===
                AppealCaseState.COMPLETED &&
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
    workingCase.appealCase?.appealState,
    workingCase.caseFiles,
    workingCase.appealCase?.defendantStatementDate,
    workingCase.prosecutorPostponedAppealDate,
    workingCase.appealCase?.prosecutorStatementDate,
  ])

  return (
    isCompletedCase(workingCase.state) &&
    allFiles &&
    allFiles.length > 0 && (
      <div className={grid({ gap: 3 })}>
        <Box>
          <SectionHeading
            title="Skjöl kærumáls"
            tooltip={
              isProsecutionUser(user) && !isIndictmentCase(workingCase.type)
                ? 'Verjandi sér einungis kæru og greinargerð.'
                : undefined
            }
            marginBottom={1}
          />
          {allFiles.map((file) => {
            const isDisabled = !file.isKeyAccessible
            const canDeleteFile =
              (isProsecutionUser(user) &&
                isProsecutorCategory(file.category)) ||
              (isDefenceUser(user) &&
                isDefenceCategory(file.category) &&
                isUserCaseFile(workingCase, file, user))

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
                        <Text whiteSpace="nowrap" variant="small">
                          {getFileSubmittedByText(file, workingCase)}
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
          workingCase.appealCase?.appealState &&
          workingCase.appealCase?.appealState !== AppealCaseState.COMPLETED && (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                icon="add"
                onClick={() => {
                  router.push(
                    limitedAccess
                      ? `${constants.DEFENDER_APPEAL_FILES_ROUTE}/${workingCase.id}`
                      : `${constants.APPEAL_FILES_ROUTE}/${workingCase.id}`,
                  )
                }}
                disabled={
                  workingCase.appealCase?.appealState ===
                  AppealCaseState.WITHDRAWN
                }
              >
                {formatMessage(strings.addFiles)}
              </Button>
            </Box>
          )}
        <AnimatePresence>
          {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
        </AnimatePresence>
      </div>
    )
  )
}

export default AppealCaseFilesOverview
