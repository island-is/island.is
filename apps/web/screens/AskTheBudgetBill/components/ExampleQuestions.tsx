import { Stack, Text } from '@island.is/island-ui/core'

import * as styles from './ExampleQuestions.css'

interface ExampleQuestionsProps {
  title: string
  /** The questions to offer, with the ones the CMS has emptied already gone */
  questions: string[]
  /** Asks the question, the same way typing it into the box would */
  onSelect: (question: string) => void
  /** Closed off along with the question box when the widget never came up */
  disabled?: boolean
}

/**
 * The questions offered underneath the question box, to show what the chat can
 * be asked about. Picking one asks it right away rather than filling the box.
 */
export const ExampleQuestions = ({
  title,
  questions,
  onSelect,
  disabled,
}: ExampleQuestionsProps) => (
  <Stack space={2}>
    <Text variant="h4" as="h2">
      {title}
    </Text>

    {questions.map((question, index) => (
      <button
        // The questions are free text from the CMS, so two of them can read
        // the same without the list being broken
        key={`${index}-${question}`}
        type="button"
        className={styles.question}
        disabled={disabled}
        onClick={() => onSelect(question)}
      >
        {question}
      </button>
    ))}
  </Stack>
)
