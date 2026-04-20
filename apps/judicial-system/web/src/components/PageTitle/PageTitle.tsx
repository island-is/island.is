import { FC, PropsWithChildren, useContext } from 'react'
import { useIntl } from 'react-intl'
import { useRouter } from 'next/router'

import {
  Box,
  Button,
  ResponsiveProp,
  Space,
  Text,
} from '@island.is/island-ui/core'
import { core } from '@island.is/judicial-system-web/messages'
import {
  CaseListEntry,
  CaseState,
} from '@island.is/judicial-system-web/src/graphql/schema'

import { FormContext } from '../FormProvider/FormProvider'
import TagCaseState from '../Tags/TagCaseState/TagCaseState'
import { mapIndictmentRulingDecisionToTagVariant } from '../Tags/TagCaseState/TagCaseState.logic'

interface Props {
  marginBottom?: ResponsiveProp<Space>
  previousUrl?: string
  includeTag?: boolean
}

const PageTitle: FC<PropsWithChildren<Props>> = (props) => {
  const { marginBottom, previousUrl, children, includeTag = false } = props
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()

  const showRulingDecisionTag =
    includeTag && workingCase.state !== CaseState.CORRECTING

  return (
    <Box
      marginBottom={marginBottom ?? 7}
      display="flex"
      justifyContent="spaceBetween"
    >
      <Box>
        {previousUrl && (
          <Box marginBottom={2}>
            <Button
              variant="text"
              preTextIcon="arrowBack"
              onClick={() => router.push(previousUrl)}
            >
              {formatMessage(core.back)}
            </Button>
          </Box>
        )}
        <Text as="h1" variant="h1">
          {children}
        </Text>
      </Box>
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
