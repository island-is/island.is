import React from 'react'
import { useIntl } from 'react-intl'

import { Case } from '@island.is/judicial-system/types'
import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'

import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import { useCase } from '../../utils/hooks'
import { commentsInput } from '@island.is/judicial-system-web/messages/Core/commentsInput'

interface Props {
  workingCase: Case
  setWorkingCase: React.Dispatch<React.SetStateAction<Case>>
}
const CommentsInput: React.FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()

  return (
    <>
      <Box marginBottom={3}>
        <Text as="h3" variant="h3">
          {formatMessage(commentsInput.heading)}{' '}
          <Tooltip
            placement="right"
            as="span"
            text={formatMessage(commentsInput.tooltip)}
          />
        </Text>
      </Box>
      <Input
        name="comments"
        label={formatMessage(commentsInput.label)}
        placeholder={formatMessage(commentsInput.placeholder)}
        value={workingCase.comments || ''}
        onChange={(event) =>
          removeTabsValidateAndSet(
            'comments',
            event.target.value,
            [],
            workingCase,
            setWorkingCase,
          )
        }
        onBlur={(event) =>
          validateAndSendToServer(
            'comments',
            event.target.value,
            [],
            workingCase,
            updateCase,
          )
        }
        textarea
        rows={7}
        autoExpand={{ on: true, maxHeight: 300 }}
      />
    </>
  )
}

export default CommentsInput
