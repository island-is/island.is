import type { FC } from 'react'
import { useContext, useMemo } from 'react'

import type { IconMapIcon } from '@island.is/island-ui/core'
import { AccordionItem, Box, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import {
  formatDate,
  formatFileSubmittedBy,
} from '@island.is/judicial-system/formatters'
import {
  isAppealFileDeletionLocked,
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
import type {
  AppealCase,
  Case,
  CaseFile,
} from '@island.is/judicial-system-web/src/graphql/schema'
import { CaseFileCategory } from '@island.is/judicial-system-web/src/graphql/schema'
import type { TUploadFile } from '@island.is/judicial-system-web/src/utils/hooks'
import { useS3Upload } from '@island.is/judicial-system-web/src/utils/hooks'
import {
  isAppealFileCategoryVisible,
  isMatchingAppealCaseFile,
} from '@island.is/judicial-system-web/src/utils/utils'

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
    return formatFileSubmittedBy('Sækjandi')
  }

  if (file.defendantId) {
    const defendant = workingCase.defendants?.find(
      (d) => d.id === file.defendantId,
    )

    if (defendant?.defenderName) {
      return formatFileSubmittedBy('Verjandi', defendant.defenderName)
    }
  }

  if (file.civilClaimantId) {
    const civilClaimant = workingCase.civilClaimants?.find(
      (cc) => cc.id === file.civilClaimantId,
    )

    if (civilClaimant?.spokespersonName) {
      return formatFileSubmittedBy(
        civilClaimant.spokespersonIsLawyer ? 'Lögmaður' : 'Réttargæslumaður',
        civilClaimant.spokespersonName,
      )
    }
  }

  return formatFileSubmittedBy('Varnaraðili')
}

interface Props {
  appealCase: AppealCase
  rulingFile: CaseFile
  onOpenFile: (fileId: string) => void
  hideTrailingSeparator?: boolean
}

const RulingOrderAppealFilesAccordion: FC<Props> = ({
  appealCase,
  rulingFile,
  onOpenFile,
  hideTrailingSeparator = false,
}) => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { handleRemove } = useS3Upload(workingCase.id)

  const files = useMemo(
    () =>
      (workingCase.caseFiles ?? []).filter((file) =>
        isAppealFileCategoryVisible(workingCase, appealCase, file, user),
      ),
    [workingCase, appealCase, user],
  )

  const deleteCategories = isProsecutionUser(user)
    ? prosecutorDeleteCategories
    : isDefenceUser(user)
    ? defenceDeleteCategories
    : []
  // Files can no longer be deleted once the court of appeals has registered its
  // case number, as they have been delivered to the court of appeals by then
  const canDeleteFile = (file: CaseFile) =>
    isMatchingAppealCaseFile(
      workingCase,
      deleteCategories,
      file,
      user,
      appealCase.rulingFileId,
    ) && !isAppealFileDeletionLocked(file.category, appealCase)

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
      <Box
        className={
          hideTrailingSeparator ? styles.filesListHideTrailing : undefined
        }
      >
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
                                  setWorkingCase((prev) => ({
                                    ...prev,
                                    caseFiles: prev.caseFiles?.filter(
                                      (f) => f.id !== file.id,
                                    ),
                                  }))
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
                        ariaLabel={`Valmynd fyrir ${file.name}`}
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
