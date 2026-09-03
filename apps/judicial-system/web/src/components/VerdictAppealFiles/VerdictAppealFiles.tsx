import type { FC } from 'react'
import { useContext } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box, Text } from '@island.is/island-ui/core'
import { TIME_FORMAT } from '@island.is/judicial-system/consts'
import { formatDate, getInitials } from '@island.is/judicial-system/formatters'
import ContextMenu from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import IconButton from '@island.is/judicial-system-web/src/components/IconButton/IconButton'
import FileNotFoundModal from '@island.is/judicial-system-web/src/components/Modals/FileNotFoundModal/FileNotFoundModal'
import PdfButton from '@island.is/judicial-system-web/src/components/PdfButton/PdfButton'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { getVerdictAppealFileGroups } from './VerdictAppealFiles.logic'

// Appeal documents are "sent in" (design, 2026-09-03), unlike the case files
// the shared formatter describes as "lagt fram".
const formatSentInBy = (defenderName?: string | null): string => {
  const initials = getInitials(defenderName)

  return initials ? `Verjandi (${initials}) sendi inn` : 'Verjandi sendi inn'
}

/**
 * The "Áfrýjunarferli" section of a completed indictment: the
 * áfrýjunaryfirlýsing each defendant's defender filed, with whatever came with
 * it. Renders nothing until there is something to show. Which files that is, and
 * for whom, is decided by getVerdictAppealFileGroups.
 *
 * The rows offer no deletion: a declaration is the appeal itself, and the way to
 * take it back is to withdraw the appeal from the verdict timeline card.
 */
const VerdictAppealFiles: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const groups = getVerdictAppealFileGroups(workingCase, user)

  if (groups.length === 0) {
    return null
  }

  return (
    <Box component="section" dataTestId="verdictAppealFiles">
      <SectionHeading title="Áfrýjunarferli" marginBottom={2} />
      {groups.map(({ defendant, files }) => (
        <Box key={defendant.id} marginBottom={2}>
          {groups.length > 1 && (
            <Text variant="eyebrow" marginBottom={1}>
              {defendant.name}
            </Text>
          )}
          {files.map((file) => (
            <PdfButton
              key={file.id}
              renderAs="row"
              title={file.name}
              disabled={!file.isKeyAccessible}
              handleClick={() => onOpen(file.id)}
            >
              <Box display="flex" alignItems="center" justifyContent="flexEnd">
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flexEnd"
                  textAlign="right"
                >
                  <Text whiteSpace="nowrap">
                    {`${formatDate(file.created, 'dd.MM.y')} kl. ${formatDate(
                      file.created,
                      TIME_FORMAT,
                    )}`}
                  </Text>
                  <Text whiteSpace="nowrap" variant="small">
                    {formatSentInBy(defendant.defenderName)}
                  </Text>
                </Box>
                <Box marginLeft={3}>
                  <ContextMenu
                    items={[
                      {
                        title: 'Opna',
                        onClick: () => onOpen(file.id),
                        icon: 'open',
                      },
                    ]}
                    render={
                      <IconButton
                        icon="ellipsisVertical"
                        colorScheme="transparent"
                        ariaLabel={`Valmynd fyrir ${file.name}`}
                        disabled={!file.isKeyAccessible}
                        onClick={(evt) => {
                          evt.stopPropagation()
                        }}
                      />
                    }
                  />
                </Box>
              </Box>
            </PdfButton>
          ))}
        </Box>
      ))}
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </Box>
  )
}

export default VerdictAppealFiles
