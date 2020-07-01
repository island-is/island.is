import React, { FC } from 'react'
import {
  Answers,
  FormItemTypes,
  FormScreen,
  Section,
} from '@island.is/application/schema'
import { Typography, Box, Button, Divider } from '@island.is/island-ui/core'
import FormMultiField from './form-multi-field'
import FormField from './form-field'

type ScreenProps = {
  answers: Answers
  answerQuestion({ id: string, answer: any }): void
  nextScreen(): void
  prevScreen(): void
  screen: FormScreen
  section?: Section
}

const Screen: FC<ScreenProps> = ({
  answers,
  answerQuestion,
  nextScreen,
  prevScreen,
  screen,
  section,
}) => {
  return (
    <Box>
      {section && <Typography variant="breadcrumb">{section.name}</Typography>}
      <Typography variant="h2">{screen.name}</Typography>
      <Box>
        {screen.type === FormItemTypes.REPEATER ? null : screen.type ===
          FormItemTypes.MULTI_FIELD ? (
          <FormMultiField
            multiField={screen}
            answerQuestion={answerQuestion}
            answers={answers}
          />
        ) : (
          <FormField
            field={screen}
            answers={answers}
            answerQuestion={answerQuestion}
          />
        )}
      </Box>
      <Divider />
      <Box
        bottom={0}
        paddingTop={7}
        paddingBottom={7}
        justifyContent="spaceEvenly"
      >
        <Box padding={2}>
          <Button variant="text" leftIcon="arrowLeft" onClick={prevScreen}>
            Til baka
          </Button>
        </Box>
        <Box padding={2}>
          <Button variant="text" icon="arrowRight" onClick={nextScreen}>
            Halda áfram
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Screen
