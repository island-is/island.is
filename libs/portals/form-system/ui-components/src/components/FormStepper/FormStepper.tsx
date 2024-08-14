import { FormSystemGroup, FormSystemStep } from '@island.is/api/schema'
import {
  GridColumn as Column,
  Box,
  FormStepperV2,
  Section,
  FormStepperThemes,
  Text,
} from '@island.is/island-ui/core'

interface Props {
  steps: FormSystemStep[]
  groups: FormSystemGroup[]
  currentStepIndex: number
  currentGroupIndex: number
}

export const FormStepper = ({
  steps,
  groups,
  currentStepIndex,
  currentGroupIndex,
}: Props) => {
  const groupsByStepGuid = groups.reduce((acc, group) => {
    if (group.stepGuid) {
      if (!acc[group.stepGuid]) {
        acc[group.stepGuid] = []
      }
      acc[group.stepGuid].push(group)
    }
    return acc
  }, {} as Record<string, FormSystemGroup[]>)

  return (
    <Column span="3/10">
      <Box paddingLeft={2}>
        <FormStepperV2
          sections={steps.map((step, stepIndex) => (
            <Section
              key={step.guid}
              section={step.name?.is ?? ''}
              sectionIndex={stepIndex}
              isActive={stepIndex === currentStepIndex}
              theme={FormStepperThemes.BLUE}
              subSections={(step.guid && groupsByStepGuid[step.guid]
                ? groupsByStepGuid[step.guid]
                : []
              ).map((group, groupIndex) => (
                <Text
                  key={`s${stepIndex}g${groupIndex}`}
                  fontWeight={
                    currentGroupIndex ===
                    groups.findIndex((g) => g.guid === group.guid)
                      ? 'semiBold'
                      : 'regular'
                  }
                >
                  {group.name?.is ?? ''}
                </Text>
              ))}
            />
          ))}
        />
      </Box>
    </Column>
  )
}
