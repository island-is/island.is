import { FC, useContext } from 'react'

import { Accordion, Box } from '@island.is/island-ui/core'

import ConnectedCaseFilesAccordionItem from '../AccordionItems/ConnectedCaseFilesAccordionItem/ConnectedCaseFilesAccordionItem'
import AppealCaseFilesOverview from '../AppealCaseFilesOverview/AppealCaseFilesOverview'
import { FormContext } from '../FormProvider/FormProvider'
import IndictmentCaseFilesList from '../IndictmentCaseFilesList/IndictmentCaseFilesList'

interface Props {
  displayGeneratedPDFs?: boolean
}

const AllIndictmentCaseFiles: FC<Props> = ({ displayGeneratedPDFs }) => {
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
        />
      </Box>
    </>
  )
}

export default AllIndictmentCaseFiles
