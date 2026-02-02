import { FC } from 'react'
import { useIntl } from 'react-intl'

import { Input } from '@island.is/island-ui/core'
import { commentsInput as strings } from '@island.is/judicial-system-web/messages/Core/commentsInput'

import { useDebouncedInput } from '../../utils/hooks'
import SectionHeading from '../SectionHeading/SectionHeading'

const CommentsInput: FC = () => {
  const { formatMessage } = useIntl()
  const commentsInput = useDebouncedInput('comments', [])

  return (
    <>
      <SectionHeading
        title={formatMessage(strings.heading)}
        tooltip={formatMessage(strings.tooltip)}
      />
      <Input
        name="comments"
        label={formatMessage(strings.label)}
        placeholder={formatMessage(strings.placeholder)}
        value={commentsInput.value}
        onChange={(evt) => commentsInput.onChange(evt.target.value)}
        textarea
        rows={7}
      />
    </>
  )
}

export default CommentsInput
