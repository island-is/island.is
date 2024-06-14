import { useLoaderData } from "react-router-dom"
import { FormSystemFormResponse } from "@island.is/api/schema"
import {
  GridContainer,
  GridRow as Row,
  GridColumn as Column,
  Box,
  FormStepperV2 as FormStepper,
  Section,
  FormStepperThemes
} from '@island.is/island-ui/core'


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

export const FormPreview = () => {
  const formBuilder = useLoaderData() as FormSystemFormResponse
  const { form } = formBuilder
  const { stepsList: steps, groupsList: groups, inputsList: inputs } = form || {}

  return (
    <GridContainer>
      <Row>
        <Column span="5/10">

        </Column>
        <Column span="5/10">
          <FormStepper
            sections={steps?.map((step, i) => {
              return <Section section={step?.name?.is ?? ''} sectionIndex={i} isActive={i === 0} theme={FormStepperThemes.BLUE} />
            }) || []}
          />
        </Column>
      </Row>
    </GridContainer>
  )
}
