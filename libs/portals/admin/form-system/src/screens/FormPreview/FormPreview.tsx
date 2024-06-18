import { useLoaderData } from "react-router-dom"
import { FormSystemFormResponse, FormSystemStep } from "@island.is/api/schema"
import {
  GridRow as Row,
  GridColumn as Column,
  Box,
  FormStepperV2 as FormStepper,
  Section,
  FormStepperThemes,
  Button,
  Text
} from '@island.is/island-ui/core'
import { useState } from "react"
import { FormPreviewLoader } from "./FormPreview.loader"
import { Preview } from "../../components/MainContent/components/Preview/Preveiw"


{/*
  <FormStepperV2
      sections={[
        <Section isComplete section={'Section #1'} />,
        <Section
          section={'Section #2'}
          isActive
          subSections={[
            <Text key="sub1" fontWeight="semiBold">
              Subsection #1
            </Text>,
            <Text key="sub2">Subsection #2</Text>,
            <Text key="sub3">Subsection #3</Text>,
          ]}
        />,
        <Section section={'Section #3'} />,
        <Section section={'Section #4'} />,
        <Section section={'Section #5'} />,
      ]}
    />
  */}

{/*
  Current step
  Current group
*/}

export const FormPreview = () => {
  const { formBuilder } = useLoaderData() as FormPreviewLoader
  const { form } = formBuilder
  const { stepsList: steps, groupsList: groups, inputsList: inputs } = form || {}
  const [currentStep, setCurrentStep] = useState<number>(0)
  console.log(formBuilder)
  console.log('form', form)
  console.log(steps)

  const forward = () => {
    setCurrentStep(prev => prev + 1)
  }

  const back = () => {
    setCurrentStep(prev => prev - 1)
  }

  return (
    <Row>
      <Column span="7/10">
        <Row>
          <Box
            style={{ minHeight: '500px', width: '100%' }}
            background="blue100"
          >
            {steps?.[currentStep]?.type === 'Input' && groups?.filter(g => g?.stepGuid === steps?.[currentStep]?.guid).map(g => {
              return (
                <Box key={g?.guid}>
                  <Text variant="h2">{g?.name?.is}</Text>
                  {inputs?.filter(i => i?.groupGuid === g?.guid).map(i => {
                    if (i) {
                      return (
                        <Box key={i?.guid}>
                          <Preview data={i} />
                        </Box>
                      )
                    }
                    return null;
                  })}
                </Box>
              )
            })}
          </Box>
        </Row>
        <Row marginTop={1}>
          <Column span="2/10">
            <Button variant="ghost" onClick={() => back()}> Til baka</Button>
          </Column>
          <Column span="2/10" offset="6/10">
            <Button onClick={() => forward()}>Áfram</Button>
          </Column>
        </Row>
      </Column>
      <Column span="3/10">
        <FormStepper
          sections={steps?.map((step, i) => {
            return (
              <Section
                section={step?.name?.is ?? ''}
                sectionIndex={i}
                isActive={i === currentStep}
                theme={FormStepperThemes.BLUE}
                subSections={groups?.filter(g => g?.stepGuid === step?.guid).map((group, j) => {
                  return <Text key={`s${i}g${j}`}>{group?.name?.is}</Text>
                }) || []}
              />
            )
          }) || []
          }
        />
      </Column>
    </Row>
  )
}
