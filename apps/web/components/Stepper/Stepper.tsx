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

interface StepperProps {
  stepper: Query['getProjectPage']['stepper']
}

export const Stepper = ({ stepper }: StepperProps) => {
  const [step, setStep] = useState('')

  const currentStep = useMemo(
    () => stepper?.steps.find((x) => x.slug === step) ?? stepper?.steps[0],
    [step],
  )

  const steps = stepper?.steps.map((x) => x.slug)

  stepper?.steps.forEach((x) => {
    JSON.parse(x.options).forEach((y) => {
      if (!steps.includes(y.nextStep)) {
        console.log(x.slug, y.key)
      }
    })
  })

  return (
    <Box style={{ minHeight: 400 }}>
      <GridContainer>
        <GridRow>
          <GridColumn span={['12/12', '12/12', '5/12']}>
            <Text variant="h2">{currentStep.title}</Text>
            {richText(currentStep.subtitle as SliceType[])}
            <GridContainer>
              <GridRow marginTop={8}>
                {JSON.parse(currentStep.options).map((x) => (
                  <GridColumn span={['12/12', '12/12', '6/12']}>
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
                  <GridColumn span={['12/12', '12/12', '6/12']}>
                    <Button
                      key={'start-again'}
                      fluid
                      variant="ghost"
                      onClick={() => setStep('')}
                    >
                      Start again
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
