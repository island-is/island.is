import type { FC } from 'react'

import type { TextProps } from '@island.is/island-ui/core'
import { Text } from '@island.is/island-ui/core'

import { toExplanationLines } from './ExplanationText.logic'

interface Props {
  explanation: string
  variant?: TextProps['variant']
}

// Shows an explanation as plain text, one line per line of the explanation
const ExplanationText: FC<Props> = ({ explanation, variant }) => (
  <Text variant={variant} whiteSpace="preLine">
    {toExplanationLines(explanation)}
  </Text>
)

export default ExplanationText
