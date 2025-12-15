import { Dispatch, FC, SetStateAction } from 'react'
import { useIntl } from 'react-intl'

import { Box, Input, Text, Tooltip } from '@island.is/island-ui/core'
import { commentsInput } from '@island.is/judicial-system-web/messages/Core/commentsInput'
import { Case } from '@island.is/judicial-system-web/src/graphql/schema'

import {
  removeTabsValidateAndSet,
  validateAndSendToServer,
} from '../../utils/formHelper'
import { useCase, useDeb } from '../../utils/hooks'

interface Props {
  workingCase: Case
  setWorkingCase: Dispatch<SetStateAction<Case>>
}
const CommentsInput: FC<Props> = (props) => {
  const { workingCase, setWorkingCase } = props
  const { formatMessage } = useIntl()
  const { updateCase } = useCase()
  useDeb(workingCase, 'comments')

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
      />
    </>
  )
}

export default CommentsInput
