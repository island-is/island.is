import type { FC } from 'react'
import { useContext } from 'react'

import { Accordion, Box } from '@island.is/island-ui/core'
import ConnectedCaseFilesAccordionItem from '@island.is/judicial-system-web/src/components/AccordionItems/ConnectedCaseFilesAccordionItem/ConnectedCaseFilesAccordionItem'
import AppealCaseFilesOverview from '@island.is/judicial-system-web/src/components/AppealCaseFilesOverview/AppealCaseFilesOverview'
import { FormContext } from '@island.is/judicial-system-web/src/components/FormProvider/FormProvider'
import IndictmentCaseFilesList from '@island.is/judicial-system-web/src/components/IndictmentCaseFilesList/IndictmentCaseFilesList'

interface Props {
  displayGeneratedPDFs?: boolean
  forceDisplayAdditionalFiles?: boolean
}

const AllIndictmentCaseFiles: FC<Props> = ({
  displayGeneratedPDFs,
  forceDisplayAdditionalFiles,
}) => {
  const { workingCase } = useContext(FormContext)

  const hasMergeCases =
    workingCase.mergedCases && workingCase.mergedCases.length > 0

  return (
    <>
      <AppealCaseFilesOverview />
      {hasMergeCases && (
        <Accordion dividerOnBottom={false} dividerOnTop={false}>
          {workingCase.mergedCases?.map((mergedCase) => (
            <Box key={mergedCase.id}>
              <ConnectedCaseFilesAccordionItem
                connectedCaseParentId={workingCase.id}
                connectedCase={mergedCase}
                displayGeneratedPDFs={displayGeneratedPDFs}
              />
            </Box>
          ))}
        </Accordion>
      )}
      <Box component="section">
        <IndictmentCaseFilesList
          workingCase={workingCase}
          displayGeneratedPDFs={displayGeneratedPDFs}
          forceDisplayAdditionalFiles={forceDisplayAdditionalFiles}
        />
      </Box>
    </>
  )
}

export default AllIndictmentCaseFiles
