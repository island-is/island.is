import { FC, PropsWithChildren, useContext } from 'react'

import { Box, ResponsiveProp, Space, Text } from '@island.is/island-ui/core'
import {
  CaseListEntry,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { FormContext } from '../FormProvider/FormProvider'
import TagCaseState from '../Tags/TagCaseState/TagCaseState'
import { mapIndictmentRulingDecisionToTagVariant } from '../Tags/TagCaseState/TagCaseState.logic'

interface Props {
  marginBottom?: ResponsiveProp<Space>
  includeTag?: boolean
}

const PageTitle: FC<PropsWithChildren<Props>> = (props) => {
  const { marginBottom, children, includeTag = false } = props
  const { workingCase } = useContext(FormContext)

  const showRulingDecisionTag =
    includeTag && workingCase.state !== CaseState.CORRECTING

  return (
    <Box
      marginBottom={marginBottom ?? 7}
      display="flex"
      justifyContent="spaceBetween"
    >
      <Text as="h1" variant="h1">
        {children}
      </Text>
      {showRulingDecisionTag && (
        <TagCaseState
          theCase={workingCase as CaseListEntry}
          customMapCaseStateToTag={mapIndictmentRulingDecisionToTagVariant}
        />
      )}
    </Box>
  )
}

export default PageTitle
