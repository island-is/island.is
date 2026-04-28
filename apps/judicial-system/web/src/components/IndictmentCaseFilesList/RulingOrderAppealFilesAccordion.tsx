import { FC, useContext, useMemo, useState } from 'react'

import {
  AccordionItem,
  Box,
  IconMapIcon,
  Text,
} from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { formatDate } from '@island.is/judicial-system/formatters'
import {
  isCourtOfAppealsUser,
  isDefenceUser,
  isProsecutionUser,
} from '@island.is/judicial-system/types'
import {
  ContextMenu,
  FormContext,
  IconButton,
  PdfButton,
  UserContext,
} from '@island.is/judicial-system-web/src/components'
import {
  AppealCase,
  AppealCaseState,
  Case,
  CaseFile,
  CaseFileCategory,
} from '@island.is/judicial-system-web/src/graphql/schema'
import {
  TUploadFile,
  useS3Upload,
} from '@island.is/judicial-system-web/src/utils/hooks'
import { isMatchingAppealCaseFile } from '@island.is/judicial-system-web/src/utils/utils'

import * as styles from './RulingOrderAppealFilesAccordion.css'

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
  if (isProsecutorCategory(file.category)) {
    return 'Sækjandi lagði fram'
  }

  if (file.defendantId) {
    const defendant = workingCase.defendants?.find(
      (d) => d.id === file.defendantId,
    )

    if (defendant?.defenderName) {
      return `Verjandi ${defendant.defenderName} lagði fram`
    }
  }

  if (file.civilClaimantId) {
    const civilClaimant = workingCase.civilClaimants?.find(
      (cc) => cc.id === file.civilClaimantId,
    )

    if (civilClaimant?.spokespersonName) {
      return `${
        civilClaimant.spokespersonIsLawyer ? 'Lögmaður' : 'Réttargæslumaður'
      } ${civilClaimant.spokespersonName} lagði fram`
    }
  }

  return 'Varnaraðili lagði fram'
}

interface Props {
  appealCase: AppealCase
  rulingFile: CaseFile
  onOpenFile: (fileId: string) => void
}

const RulingOrderAppealFilesAccordion: FC<Props> = ({
  appealCase,
  rulingFile,
  onOpenFile,
}) => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { handleRemove } = useS3Upload(workingCase.id)

  const visibleCategories = useMemo<CaseFileCategory[]>(() => {
    const categories: CaseFileCategory[] = [
      // Brief files exist as soon as the appealCase row exists.
      CaseFileCategory.PROSECUTOR_APPEAL_BRIEF,
      CaseFileCategory.PROSECUTOR_APPEAL_BRIEF_CASE_FILE,
      CaseFileCategory.DEFENDANT_APPEAL_BRIEF,
      CaseFileCategory.DEFENDANT_APPEAL_BRIEF_CASE_FILE,
      CaseFileCategory.PROSECUTOR_APPEAL_CASE_FILE,
      CaseFileCategory.DEFENDANT_APPEAL_CASE_FILE,
    ]

    if (appealCase.prosecutorStatementDate) {
      categories.push(
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT,
        CaseFileCategory.PROSECUTOR_APPEAL_STATEMENT_CASE_FILE,
      )
    }

    if (appealCase.defendantStatementDate) {
      categories.push(
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT,
        CaseFileCategory.DEFENDANT_APPEAL_STATEMENT_CASE_FILE,
      )
    }

    if (
      appealCase.appealState === AppealCaseState.COMPLETED ||
      isCourtOfAppealsUser(user)
    ) {
      categories.push(
        CaseFileCategory.APPEAL_COURT_RECORD,
        CaseFileCategory.APPEAL_RULING,
      )
    }

    return categories
  }, [appealCase, user])

  const [files, setFiles] = useState<CaseFile[]>(() =>
    (workingCase.caseFiles ?? []).filter((file) =>
      isMatchingAppealCaseFile(
        workingCase,
        visibleCategories,
        file,
        user,
        appealCase.rulingFileId,
      ),
    ),
  )
  console.log('files', appealCase, visibleCategories, files)
  const deleteCategories = isProsecutionUser(user)
    ? prosecutorDeleteCategories
    : isDefenceUser(user)
    ? defenceDeleteCategories
    : []
  const canDeleteFile = (file: CaseFile) =>
    isMatchingAppealCaseFile(
      workingCase,
      deleteCategories,
      file,
      user,
      appealCase.rulingFileId,
    )

  const rulingFileName =
    rulingFile.userGeneratedFilename ?? rulingFile.name ?? 'Úrskurður'

  if (files.length === 0) {
    return null
  }

  return (
    <AccordionItem
      id={`rulingOrderAppealFiles-${appealCase.id}`}
      label={`Skjöl kærumáls — ${rulingFileName}`}
      labelVariant="h3"
      labelUse="h3"
    >
      <Box>
        {files.map((file) => {
          const isDisabled = !file.isKeyAccessible
          const canDelete = canDeleteFile(file)

          return (
            <PdfButton
              key={file.id}
              renderAs="row"
              title={file.userGeneratedFilename ?? file.name}
              disabled={isDisabled}
              handleClick={() => onOpenFile(file.id)}
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
                        onClick: () => onOpenFile(file.id),
                        icon: 'open' as IconMapIcon,
                      },
                      ...(canDelete
                        ? [
                            {
                              title: 'Eyða',
                              onClick: () =>
                                handleRemove(file as TUploadFile, () => {
                                  setFiles((prev) =>
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
    </AccordionItem>
  )
}

export default RulingOrderAppealFilesAccordion
