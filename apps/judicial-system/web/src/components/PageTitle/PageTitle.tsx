import { FC, PropsWithChildren, useContext } from 'react'

import { Box, ResponsiveProp, Space, Text } from '@island.is/island-ui/core'
import {
  isCompletedCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'

import { FormContext } from '../FormProvider/FormProvider'
import TagCaseState from '../TagCaseState/TagCaseState'

interface Props {
  marginBottom?: ResponsiveProp<Space>
}

const PageTitle: FC<PropsWithChildren<Props>> = (props) => {
  const { marginBottom, children } = props
  const { workingCase } = useContext(FormContext)

  return (
    <Box
      marginBottom={marginBottom ?? 7}
      display="flex"
      justifyContent="spaceBetween"
    >
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
