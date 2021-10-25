import { Query } from '@island.is/web/graphql/schema'
import React, { useMemo, useState } from 'react'
import {
  Box,
  Button,
  GridColumn,
  GridContainer,
  GridRow,
  Text,
} from '@island.is/island-ui/core'
import { richText, SliceType } from '@island.is/island-ui/contentful'
import * as style from './Stepper.css'

interface Option {
  key: string
  label: string
  nextStep: string
}

interface StepperProps {
  stepper: Query['getProjectPage']['stepper']
  startAgainLabel: string
  answerLabel: string
  backLabel: string
}

export const Stepper = ({
  stepper,
  startAgainLabel,
  answerLabel,
  backLabel,
}: StepperProps) => {
  const [steps, setSteps] = useState([''])

  const step = steps[steps.length - 1]

  const currentStep = useMemo(
    () =>
      stepper?.steps.find((x) => x.slug === steps[steps.length - 1]) ??
      stepper?.steps[0],
    [steps],
  )

  return (
    <Box className={style.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '12/12', '5/12']}>
            {step !== '' && (
              <Box marginBottom={2}>
                <Button
                  key={`back-${step}`}
                  preTextIcon="arrowBack"
                  preTextIconType="filled"
                  type="button"
                  variant="text"
                  size="small"
                  onClick={() => setSteps(steps.slice(0, -1))}
                >
                  {backLabel}
                </Button>
              </Box>
            )}
            {currentStep.isAnswer && (
              <Text
                variant="eyebrow"
                color="purple400"
                marginTop={4}
                marginBottom={2}
              >
                {answerLabel}
              </Text>
            )}
            <Text variant="h2">{currentStep.title}</Text>
            {richText(currentStep.subtitle as SliceType[])}
            <GridContainer>
              <GridRow marginTop={[4, 4, 4, 8]}>
                {(JSON.parse(currentStep.options) as Option[]).map((x) => (
                  <GridColumn
                    span={['12/12', '12/12', '6/12']}
                    paddingBottom={2}
                  >
                    <Button
                      key={`${currentStep.slug}-${x.key}`}
                      fluid
                      variant="ghost"
                      onClick={() => setSteps([...steps, x.nextStep])}
                    >
                      {x.label}
                    </Button>
                  </GridColumn>
                ))}
                {currentStep.isAnswer && (
                  <GridColumn
                    span={['12/12', '12/12', '6/12']}
                    paddingBottom={[2, 2, 2, 0]}
                  >
                    <Button
                      key={'start-again'}
                      fluid
                      variant="ghost"
                      onClick={() => setSteps([''])}
                    >
                      {startAgainLabel}
                    </Button>
                  </GridColumn>
                )}
              </GridRow>
            </GridContainer>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '12/12', '6/12']}
            offset={['0', '0', '0', '1/12']}
          >
            {richText(currentStep.text as SliceType[])}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
