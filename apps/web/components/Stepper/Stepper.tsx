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
import * as style from './Stepper.treat'

interface Option {
  key: string
  label: string
  nextStep: string
}

interface StepperProps {
  stepper: Query['getProjectPage']['stepper']
  startAgainLabel: string
}

export const Stepper = ({ stepper, startAgainLabel }: StepperProps) => {
  const [step, setStep] = useState('')

  const currentStep = useMemo(
    () => stepper?.steps.find((x) => x.slug === step) ?? stepper?.steps[0],
    [step],
  )

  return (
    <Box className={style.container}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '5/12']}>
            <Text variant="h2">{currentStep.title}</Text>
            {richText(currentStep.subtitle as SliceType[])}
            <GridContainer>
              <GridRow marginTop={[4, 4, 8]}>
                {(JSON.parse(currentStep.options) as Option[]).map((x) => (
                  <GridColumn
                    span={['12/12', '12/12', '6/12']}
                    paddingBottom={[2, 2, 0]}
                  >
                    <Button
                      key={`${currentStep.slug}-${x.key}`}
                      fluid
                      variant="ghost"
                      onClick={() => setStep(x.nextStep)}
                    >
                      {x.label}
                    </Button>
                  </GridColumn>
                ))}
                {currentStep.isAnswer && (
                  <GridColumn
                    span={['12/12', '12/12', '6/12']}
                    paddingBottom={[2, 2, 0]}
                  >
                    <Button
                      key={'start-again'}
                      fluid
                      variant="ghost"
                      onClick={() => setStep('')}
                    >
                      {startAgainLabel}
                    </Button>
                  </GridColumn>
                )}
              </GridRow>
            </GridContainer>
          </GridColumn>
          <GridColumn
            span={['12/12', '12/12', '6/12']}
            offset={['0', '0', '1/12']}
          >
            {richText(currentStep.text as SliceType[])}
          </GridColumn>
        </GridRow>
      </GridContainer>
    </Box>
  )
}
