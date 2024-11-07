import { FC, PropsWithChildren, useContext } from 'react'

import { Box, Text } from '@island.is/island-ui/core'
import {
  isCompletedCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { FormContext } from '../FormProvider/FormProvider'
import TagCaseState from '../TagCaseState/TagCaseState'

const PageTitle: FC<PropsWithChildren> = ({ children }) => {
  const { workingCase } = useContext(FormContext)

  return (
    <Box marginBottom={7} display="flex" justifyContent="spaceBetween">
      <Text as="h1" variant="h1">
        {children}
      </Text>
      {isIndictmentCase(workingCase.type) &&
        workingCase.indictmentRulingDecision &&
        isCompletedCase(workingCase.state) && (
          <TagCaseState
            caseState={workingCase.state}
            caseType={workingCase.type}
            indictmentRulingDecision={workingCase.indictmentRulingDecision}
          />
        )}
    </Box>
  )
}

export default PageTitle
