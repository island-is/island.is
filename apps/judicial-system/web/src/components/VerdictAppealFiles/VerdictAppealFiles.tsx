import type { FC } from 'react'
import { useContext, useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useRouter } from 'next/router'

import { Box, Button, Text } from '@island.is/island-ui/core'
import { PUBLIC_PROSECUTOR_STAFF_INDICTMENT_APPEAL_SUMMONS_ROUTE } from '@island.is/judicial-system/consts'
import { formatDate, getInitials } from '@island.is/judicial-system/formatters'
import { Feature } from '@island.is/judicial-system/types'
import { FeatureContext } from '@island.is/judicial-system-web/src/components/FeatureProvider/FeatureProvider'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import FileNotFoundModal from '@island.is/judicial-system-web/src/components/Modals/FileNotFoundModal/FileNotFoundModal'
import { Modal } from '@island.is/judicial-system-web/src/components/Modals/Modal/Modal'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { api } from '@island.is/judicial-system-web/src/services'
import {
  useAppealSummons,
  useFileList,
} from '@island.is/judicial-system-web/src/utils/hooks'

import AppealProcessFileRow from './AppealProcessFileRow'
import {
  canShowIssueAppealSummons,
  formatAppealSummonsFileName,
  getAppealSummonsMenuItems,
  getVerdictAppealFileGroups,
  showsAppealSummonses,
} from './VerdictAppealFiles.logic'

// Appeal documents are "sent in" (design, 2026-09-03), unlike the case files
// the shared formatter describes as "lagt fram". When the public prosecution
// office registered the appeal on a letter, the defender who wrote that letter
// is the one who sent it in, not the defender of record.
const formatSentInBy = (defenderName?: string | null): string => {
  const initials = getInitials(defenderName)

  return initials ? `Verjandi (${initials}) sendi inn` : 'Verjandi sendi inn'
}

/**
 * The appeal-process section of a completed indictment: the áfrýjunarstefna
 * the public prosecution office issues, and the appeal declaration each
 * defendant's defender filed, with whatever came with it. Renders nothing until
 * there is something to show. Which declarations that is, and for whom, is
 * decided by getVerdictAppealFileGroups.
 *
 * The rows offer no deletion: a declaration is the appeal itself, and the way to
 * take it back is to withdraw the appeal from the verdict timeline card.
 */
const VerdictAppealFiles: FC = () => {
  const { workingCase, setWorkingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { features } = useContext(FeatureContext)
  const router = useRouter()
  const { deleteAppealSummons, isDeletingAppealSummons } = useAppealSummons()
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })
  const [summonsIdToDelete, setSummonsIdToDelete] = useState<string>()

  const groups = getVerdictAppealFileGroups(workingCase, user)
  const isIndictmentAppealEnabled = features.includes(Feature.INDICTMENT_APPEAL)
  const showSummonses =
    isIndictmentAppealEnabled && showsAppealSummonses(workingCase, user)
  const showIssueButton =
    isIndictmentAppealEnabled && canShowIssueAppealSummons(workingCase, user)
  const summonses = workingCase.appealSummonses ?? []

  if (groups.length === 0 && !showSummonses) {
    return null
  }

  const openAppealSummonsPdf = (appealSummonsId: string) => {
    window.open(
      `${api.apiUrl}/api/case/${workingCase.id}/appealSummons/${appealSummonsId}`,
      '_blank',
    )
  }

  const handleConfirmDeleteAppealSummons = async () => {
    if (!summonsIdToDelete) {
      return
    }

    const deleted = await deleteAppealSummons(workingCase.id, summonsIdToDelete)

    if (!deleted) {
      return
    }

    setWorkingCase((prev) => ({
      ...prev,
      appealSummonses: prev.appealSummonses?.filter(
        (summons) => summons.id !== summonsIdToDelete,
      ),
    }))
    setSummonsIdToDelete(undefined)
  }

  return (
    <Box component="section" dataTestId="verdictAppealFiles">
      <SectionHeading title="Áfrýjunarferli" marginBottom={2} />
      {showSummonses && (
        <Box dataTestId="appealSummonses" marginBottom={2}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            alignItems="center"
            paddingBottom={2}
            borderBottomWidth="standard"
            borderColor="blue200"
          >
            <Text variant="small">
              {summonses.length === 0
                ? 'Áfrýjunarstefna hefur ekki verið gefin út'
                : 'Áfrýjunarstefna'}
            </Text>
            {showIssueButton && (
              <Button
                variant="text"
                size="small"
                onClick={() =>
                  router.push(
                    `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_APPEAL_SUMMONS_ROUTE}/${workingCase.id}`,
                  )
                }
              >
                Gefa út áfrýjunarstefnu
              </Button>
            )}
          </Box>
          {summonses.map((summons) => {
            const fileName = formatAppealSummonsFileName(summons)

            return (
              <AppealProcessFileRow
                key={summons.id}
                title={fileName}
                onOpen={() => openAppealSummonsPdf(summons.id)}
                menuAriaLabel={`Valmynd fyrir ${fileName}`}
                menuItems={getAppealSummonsMenuItems(
                  summons,
                  user,
                  () =>
                    router.push(
                      `${PUBLIC_PROSECUTOR_STAFF_INDICTMENT_APPEAL_SUMMONS_ROUTE}/${workingCase.id}/${summons.id}`,
                    ),
                  () => openAppealSummonsPdf(summons.id),
                  () => {
                    if (summonsIdToDelete) {
                      return
                    }

                    setSummonsIdToDelete(summons.id)
                  },
                )}
              />
            )
          })}
        </Box>
      )}
      {groups.map(({ defendant, files }) => (
        <Box key={defendant.id} marginBottom={2}>
          {groups.length > 1 && (
            <Text variant="eyebrow" marginBottom={1}>
              {defendant.name}
            </Text>
          )}
          {files.map((file) => (
            <AppealProcessFileRow
              key={file.id}
              title={file.name ?? ''}
              disabled={!file.isKeyAccessible}
              onOpen={() => onOpen(file.id)}
              menuAriaLabel={`Valmynd fyrir ${file.name}`}
              menuItems={[
                {
                  title: 'Opna',
                  onClick: () => onOpen(file.id),
                  icon: 'open',
                },
              ]}
              meta={
                <>
                  {/* Date only, no time of day. An appeal the public
                  prosecution office registers on a letter has only the date the
                  letter was filed, so showing the upload time for appeals filed
                  in the portal would make the two look inconsistent when they
                  are not (design, 2026-09-16). */}
                  <Text whiteSpace="nowrap">
                    {formatDate(file.created, 'dd.MM.y')}
                  </Text>
                  <Text whiteSpace="nowrap" variant="small">
                    {formatSentInBy(
                      defendant.appealDefenderName ?? defendant.defenderName,
                    )}
                  </Text>
                </>
              }
            />
          ))}
        </Box>
      ))}
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
      {summonsIdToDelete && (
        <Modal
          title="Eyða áfrýjunarstefnu"
          text="Ertu viss um að þú viljir eyða þessari áfrýjunarstefnu?"
          onClose={() => setSummonsIdToDelete(undefined)}
          buttons={[
            {
              text: 'Hætta við',
              onClick: () => setSummonsIdToDelete(undefined),
              variant: 'ghost',
            },
            {
              text: 'Eyða',
              onClick: () => {
                void handleConfirmDeleteAppealSummons()
              },
              colorScheme: 'destructive',
              isLoading: isDeletingAppealSummons,
            },
          ]}
        />
      )}
    </Box>
  )
}

export default VerdictAppealFiles
