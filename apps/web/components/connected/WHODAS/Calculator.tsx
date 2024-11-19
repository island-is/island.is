import { useState } from 'react'

import {
  Box,
  Button,
  Inline,
  RadioButton,
  Stack,
  Text,
} from '@island.is/island-ui/core'

interface Question {
  question: string
  answerOptions: {
    label: string
    score: number
  }[]
}

const answerOptions: Question['answerOptions'] = [
  {
    label: 'Ekkert erfitt',
    score: 0,
  },
  {
    label: 'Svolítið erfitt',
    score: 1,
  },
  {
    label: 'Nokkuð erfitt',
    score: 2,
  },
  {
    label: 'Talsvert erfitt',
    score: 3,
  },
  {
    label: 'Mjög erfitt eða gekk ekki',
    score: 4,
  },
]

const _questions: Question[] = [
  {
    question: 'Einbeita þér að ákveðnu viðfangsefni í 10 mínútur?',
    answerOptions: answerOptions,
  },
  {
    question:
      'Muna að gera mikilvæga hluti, til dæmis að taka lyf á réttum tíma?',
    answerOptions: answerOptions,
  },
]

const steps = [
  {
    title: 'Skilningur og tjáskipti',
    description: 'Síðsadf',
    questions: _questions,
  },
  {
    title: 'Test',
    description: 'Síðsadf',
    questions: [
      {
        question: 'Einbeita þér að ákveðnu viðfangsefni í 10 mínútur?',
        answerOptions: answerOptions,
      },
      {
        question:
          'Muna að gera mikilvæga hluti, til dæmis að taka lyf á réttum tíma?',
        answerOptions: answerOptions,
      },
    ],
  },
]

export const WHODASCalculator = () => {
  const [stepNumber, setStepNumber] = useState(1)

  const step = steps[stepNumber - 1]

  return (
    <Box>
      <Stack space={6}>
        <Stack space={3}>
          <Stack space={3}>
            <Text variant="h2" as="h2">
              {step.title}
            </Text>
            <Text>{step.description}</Text>
          </Stack>

          <Stack space={5}>
            {step.questions.map(({ question, answerOptions }) => {
              return (
                <Stack key={question} space={2}>
                  <Text variant="h3" as="h3">
                    {question}
                  </Text>
                  <Stack space={1}>
                    {answerOptions.map((option) => (
                      <RadioButton
                        key={option.label}
                        label={option.label}
                        value={option.label}
                      />
                    ))}
                  </Stack>
                </Stack>
              )
            })}
          </Stack>
        </Stack>

        <Inline alignY="center" space={2}>
          {stepNumber > 1 && (
            <Button
              size="small"
              variant="ghost"
              preTextIcon="arrowBack"
              onClick={() => {
                setStepNumber((s) => s - 1)
              }}
            >
              Fyrra skref
            </Button>
          )}
          <Button
            size="small"
            onClick={() => {
              setStepNumber((s) => s + 1)
            }}
          >
            Næsta skref
          </Button>
        </Inline>
      </Stack>
    </Box>
  )
}
