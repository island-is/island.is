import { useContext, useEffect, useState } from 'react'
import { useIntl } from 'react-intl'
import { AnimatePresence } from 'motion/react'
import router from 'next/router'

import { Box, Button, IconMapIcon, Text } from '@island.is/island-ui/core'
import {
  DEFENDER_APPEAL_CASE_ADD_FILES_ROUTE,
  PROSECUTION_APPEAL_CASE_ADD_FILES_ROUTE,
  TIME_FORMAT,
} from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
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
  useTargetAppealCaseByAppealCaseId,
} from '@island.is/judicial-system-web/src/utils/hooks'
import {
  isAppealFileCategoryVisible,
  isMatchingAppealCaseFile,
} from '@island.is/judicial-system-web/src/utils/utils'

import { strings } from './AppealCaseFilesOverview.strings'
import { grid } from '../../utils/styles/recipes.css'
import * as styles from './AppealCaseFilesOverview.css'

const prosecutorDeleteCategories = [
  CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
  CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
]
const defenceDeleteCategories = [
  CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
  CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
]
const isProsecutorCategory = (category: CaseFileCategory | undefined | null) =>
  category &&
  ([
    CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
    CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
  ].includes(category) ||
    prosecutorDeleteCategories.includes(category))

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
  // Resolves to the case-level appeal by default, or to the ruling-order
  // appeal selected by `?appealCaseId=…` on COA detail pages.
  const targetAppealCase = useTargetAppealCaseByAppealCaseId()

  const deleteCategories = isProsecutionUser(user)
    ? prosecutorDeleteCategories
    : isDefenceUser(user)
    ? defenceDeleteCategories
    : []
  const canDeleteFile = (file: CaseFile) =>
    isMatchingAppealCaseFile(workingCase, deleteCategories, file, user)

  useEffect(() => {
    if (workingCase.caseFiles) {
      setAllFiles(
        workingCase.caseFiles.filter((caseFile) =>
          isAppealFileCategoryVisible(
            workingCase,
            targetAppealCase,
            caseFile,
            user,
          ),
        ),
      )
    }
  }, [user, workingCase, targetAppealCase])

  return (
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
            const canDelete = canDeleteFile(file)

            return (
              <PdfButton
                key={file.id}
                renderAs="row"
                title={file.name}
                disabled={isDisabled}
                handleClick={() => onOpen(file.id)}
              >
                <Box className={styles.metadataRow}>
                  <Box className={styles.childContainer}>
                    <Text whiteSpace="nowrap">
                      {`${formatDate(file.created, 'dd.MM.y')} kl. ${formatDate(
                        file.created,
                        TIME_FORMAT,
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
                        ...(canDelete
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
          targetAppealCase?.appealState &&
          targetAppealCase.appealState !== AppealCaseState.COMPLETED && (
            <Box display="flex" justifyContent="flexEnd">
              <Button
                icon="add"
                onClick={() => {
                  router.push(
                    limitedAccess
                      ? `${DEFENDER_APPEAL_CASE_ADD_FILES_ROUTE}/${workingCase.id}`
                      : `${PROSECUTION_APPEAL_CASE_ADD_FILES_ROUTE}/${workingCase.id}`,
                  )
                }}
                disabled={
                  targetAppealCase.appealState === AppealCaseState.WITHDRAWN
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
