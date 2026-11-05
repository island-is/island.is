import type { FC } from 'react'

import { Input } from '@island.is/island-ui/core'
import { commentsInput as strings } from '@island.is/judicial-system-web/messages/Core/commentsInput'
import SectionHeading from '@island.is/judicial-system-web/src/components/SectionHeading/SectionHeading'
import { useDebouncedInput } from '@island.is/judicial-system-web/src/utils/hooks'

const CommentsInput: FC = () => {
  const commentsInput = useDebouncedInput('comments', [])

  return (
    <>
      <SectionHeading title={strings.heading} tooltip={strings.tooltip} />
      <Input
        name="comments"
        label={strings.label}
        placeholder={strings.placeholder}
        value={commentsInput.value}
        onChange={(evt) => commentsInput.onChange(evt.target.value)}
        textarea
        rows={7}
      />
    </>
  )
}

export default CommentsInput
