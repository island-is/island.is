import { useLoaderData } from "react-router-dom"
import {
  GridRow as Row,
  GridColumn as Column,
  Box,
  Button,
  Text,
  Icon
} from '@island.is/island-ui/core'
import { useReducer } from "react"
import { FormPreviewLoader } from "./FormPreview.loader"
import { FormSystemDocumentType, FormSystemGroup, FormSystemInput, FormSystemStep } from "@island.is/api/schema"
import { initialPreviewControlState, previewControlReducer } from "../../hooks/previewControlReducer"
// eslint-disable-next-line @nx/enforce-module-boundaries
import { PremisesPreview, m, FormStepper, RelevantPartiesView, FieldComponentsView } from '@island.is/form-system/ui'
import { useIntl } from "react-intl"

export const FormPreview = () => {
  const { formBuilder } = useLoaderData() as FormPreviewLoader
  const { form } = formBuilder
  const { stepsList, groupsList, inputsList } = form ?? {}
  const documents = form?.documentTypes ?? [] as FormSystemDocumentType[]
  const { formatMessage } = useIntl()

  const steps = (stepsList ?? []).filter((step): step is FormSystemStep => step != null)
  const groups = (groupsList ?? []).filter((group): group is FormSystemGroup => group != null)
  const inputs = (inputsList ?? []).filter((input): input is FormSystemInput => input != null)

  const [control, controlDispatch] = useReducer(
    previewControlReducer,
    initialPreviewControlState(steps, groups)
  )

  const handleForward = () => controlDispatch({ type: 'INCREMENT' })
  const handleBack = () => controlDispatch({ type: 'DECREMENT' })

  const renderInputGroup = (group: FormSystemGroup) => (
    <Box key={group.guid} marginBottom={4}>
      <Box marginBottom={2}>
        <Text variant="h2">{group.name?.is}</Text>
      </Box>
      {inputs
        .filter(i => i.groupGuid === group.guid && i.groupGuid === groups[control.currentGroup.index]?.guid)
        .map(input => (
          <Box key={input.guid} marginBottom={3}>
            <FieldComponentsView data={input} />
          </Box>
        ))}
    </Box>
  )

  const renderStepContent = () => {
    if (steps.length === 0 || groups.length === 0) return null

    const currentStepObj = steps[control.currentStep.index]
    if (!currentStepObj) return null

    return (
      <Column span="7/10">
        <Row>
          <Box
            style={{ minHeight: '700px', width: '100%' }}
            background="blue100"
            padding={5}
            borderRadius="standard"
          >
            {currentStepObj.type === 'Premises' ? (
              <PremisesPreview documents={documents} />
            ) : currentStepObj.type === 'Parties' ? (
              <RelevantPartiesView />
            ) : currentStepObj.type === 'Input' && (
              groups
                .filter(g => g.stepGuid === currentStepObj.guid && g.guid === groups[control.currentGroup.index]?.guid)
                .map(renderInputGroup)
            )}
          </Box>
        </Row>
        <Row marginTop={1}>
          <Box
            display="flex"
            justifyContent="spaceBetween"
            style={{ width: '100%' }}
            padding={5}
          >
            <Button variant="ghost" onClick={handleBack}>{formatMessage(m.back)}</Button>
            <Button onClick={handleForward}>{formatMessage(m.continue)} <Icon icon="arrowForward" /></Button>
          </Box>
        </Row>
      </Column>
    )
  }

  return (
    <Row>
      {renderStepContent()}
      <FormStepper
        steps={steps}
        groups={groups}
        currentStepIndex={control.currentStep.index}
        currentGroupIndex={control.currentGroup.index}
      />
    </Row>
  )
}
