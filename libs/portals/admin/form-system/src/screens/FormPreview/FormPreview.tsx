import { useLoaderData } from "react-router-dom"
import {
  GridRow as Row,
  GridColumn as Column,
  Box,
  FormStepperV2 as FormStepper,
  Section,
  FormStepperThemes,
  Button,
  Text,
  Icon
} from '@island.is/island-ui/core'
import { useState } from "react"
import { FormPreviewLoader } from "./FormPreview.loader"
import { Preview } from "../../components/MainContent/components/Preview/Preveiw"
import { PremisesPreview } from "../../components/FormPreview/PremisesPreview"
import { FormSystemDocumentType } from "@island.is/api/schema"


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
  const { stepsList: steps, groupsList: groups, inputsList: inputs } = form ?? {}
  const [currentStep, setCurrentStep] = useState<number>(0)
  const [currentGroup, setCurrentGroup] = useState<number>(0)
  const documents = form?.documentTypes ?? [] as FormSystemDocumentType[]

  const handleForward = () => {
    setCurrentStep(prev => prev + 1)
    if (steps?.[currentStep]?.type === 'Input') {
      setCurrentGroup(prev => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(prev => prev - 1)
    if (steps?.[currentStep]?.type === 'Input') {
      setCurrentGroup(prev => prev - 1)
    }
  }

  const renderStepContent = () => {
    if (!steps || !groups || !inputs) {
      return null
    }

    const currentStepObj = steps[currentStep]

    if (!currentStepObj) {
      return null
    }

    return (
      <Column span="7/10">
        <Row>
          <Box
            style={{ minHeight: '500px', width: '100%' }}
            background="blue100"
            padding={5}
            borderRadius="standard"
          >
            {currentStepObj.type === 'Premises' ? <PremisesPreview documents={documents} /> : currentStepObj.type === 'Input' &&
              groups
                .filter((g) => g?.stepGuid === currentStepObj.guid)
                .map((g) => (
                  <Box key={g?.guid} marginBottom={4}>
                    <Box marginBottom={2}>
                      <Text variant="h2">{g?.name?.is}</Text>
                    </Box>
                    {inputs
                      .filter((i) => i?.groupGuid === g?.guid)
                      .map((i) => (
                        <Box key={i?.guid} marginBottom={3}>
                          {i && <Preview data={i} />}
                        </Box>
                      ))}
                  </Box>
                ))}
          </Box>
        </Row>
        <Row marginTop={1}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            style={{ width: '100%' }}
            padding={5}
          >
            <Button variant="ghost" onClick={handleBack}> Til baka</Button>
            <Button onClick={handleForward}>Halda áfram   <Icon icon="arrowForward" /></Button>
          </Box>
        </Row>
      </Column>
    )
  }

  const renderStepper = () => {
    if (!steps || !groups) {
      return null
    }

    return (
      <Column span="3/10">
        <Box
          paddingLeft={2}
        >
          <FormStepper
            sections={steps.map((step, i) => (
              <Section
                section={step?.name?.is ?? ''}
                sectionIndex={i}
                isActive={i === currentStep}
                theme={FormStepperThemes.BLUE}
                subSections={groups
                  .filter((g) => g?.stepGuid === step?.guid)
                  .map((group, j) => {
                    return (
                      currentGroup === groups.findIndex((g) => group?.guid === g?.guid) ? (
                        <Text key={`s${i}g${j}`} fontWeight="semiBold">
                          {group?.name?.is}
                        </Text>
                      ) : (
                        <Text key={`s${i}g${j}`}>{group?.name?.is}</Text>
                      )
                    );
                  })}
              />
            ))}
          />
        </Box >
      </Column>
    )
  }

  return (
    <Row>
      {renderStepContent()}
      {renderStepper()}
    </Row>
  )
}
