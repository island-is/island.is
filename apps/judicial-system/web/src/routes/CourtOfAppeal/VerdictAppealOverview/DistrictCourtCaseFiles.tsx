import type { FC } from 'react'
import { useContext } from 'react'
import { AnimatePresence } from 'motion/react'

import { Box, Text } from '@island.is/island-ui/core'
import { formatDate } from '@island.is/judicial-system/formatters'
import { hasGeneratedCourtRecordPdf } from '@island.is/judicial-system/types'
import ContextMenu from '@island.is/judicial-system-web/src/components/ContextMenu/ContextMenu'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import IconButton from '@island.is/judicial-system-web/src/components/IconButton/IconButton'
import FileNotFoundModal from '@island.is/judicial-system-web/src/components/Modals/FileNotFoundModal/FileNotFoundModal'
import PdfButton from '@island.is/judicial-system-web/src/components/PdfButton/PdfButton'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import { UserContext } from '@island.is/judicial-system-web/src/components/UserProvider/UserProvider'
import { useFileList } from '@island.is/judicial-system-web/src/utils/hooks'

import { getDistrictCourtCaseFiles } from './DistrictCourtCaseFiles.logic'

/**
 * The verdict and the court record of the case being appealed, laid out the
 * same way as the appeal process section above it so the page reads as one
 * list of documents in two parts.
 */
const DistrictCourtCaseFiles: FC = () => {
  const { workingCase } = useContext(FormContext)
  const { user } = useContext(UserContext)
  const { onOpen, fileNotFound, dismissFileNotFound } = useFileList({
    caseId: workingCase.id,
  })

  const files = getDistrictCourtCaseFiles(workingCase)

  // The court record is generated from the court sessions rather than
  // uploaded, so it is a button of its own rather than one of the files above.
  const hasCourtRecord = hasGeneratedCourtRecordPdf(
    workingCase.state,
    workingCase.indictmentRulingDecision,
    workingCase.withCourtSessions,
    workingCase.courtSessions,
    user,
  )

  if (files.length === 0 && !hasCourtRecord) {
    return null
  }

  return (
    <Box component="section" dataTestId="districtCourtCaseFiles">
      <SectionHeading title="Skjöl héraðsdómsmáls" marginBottom={2} />
      {files.map((file) => (
        <PdfButton
          key={file.id}
          renderAs="row"
          title={file.name}
          disabled={!file.isKeyAccessible}
          handleClick={() => onOpen(file.id)}
        >
          <Box display="flex" alignItems="center" justifyContent="flexEnd">
            <Text whiteSpace="nowrap">
              {formatDate(file.created, 'dd.MM.y')}
            </Text>
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
      {hasCourtRecord && (
        <PdfButton
          caseId={workingCase.id}
          title={`Þingbók ${workingCase.courtCaseNumber}.pdf`}
          pdfType="courtRecord"
          renderAs="row"
          elementId="Þingbók"
        />
      )}
      <AnimatePresence>
        {fileNotFound && <FileNotFoundModal dismiss={dismissFileNotFound} />}
      </AnimatePresence>
    </Box>
  )
}

export default DistrictCourtCaseFiles
