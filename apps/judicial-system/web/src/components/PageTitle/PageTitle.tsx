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
import {
  isCompletedCase,
  isIndictmentCase,
} from '@island.is/judicial-system/types'
import { core } from '@island.is/judicial-system-web/messages'

import { CaseListEntry } from '../../graphql/schema'
import { FormContext } from '../FormProvider/FormProvider'
import TagCaseState from '../Tags/TagCaseState/TagCaseState'

interface Props {
  marginBottom?: ResponsiveProp<Space>
  previousUrl?: string
}

const PageTitle: FC<PropsWithChildren<Props>> = (props) => {
  const { marginBottom, previousUrl, children } = props
  const { workingCase } = useContext(FormContext)
  const { formatMessage } = useIntl()
  const router = useRouter()

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
      {isIndictmentCase(workingCase.type) &&
        workingCase.indictmentRulingDecision &&
        isCompletedCase(workingCase.state) && (
          <TagCaseState theCase={workingCase as CaseListEntry} />
        )}
    </Box>
  )
}

export default PageTitle
