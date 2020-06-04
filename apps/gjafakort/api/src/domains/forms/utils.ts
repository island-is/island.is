import {
  RawFormStep,
  RawFormStepType,
  RawFormStepFollowupCondition,
  RawFormStepFollowupConditionAnswer,
  RawFormStepOption,
  RawForm,
} from './types'

const processOptions = (options: RawFormStepOption[]) => {
  if (!options) {
    return []
  }

  return options.map((option) => {
    const { label, value } = option.fields

    return {
      label,
      value: value.fields.id,
    }
  })
}

const processAnswer = ({ fields }: RawFormStepFollowupConditionAnswer) => {
  const { id } = fields

  return id
}

const processFollowupConditions = (
  followupConditions: RawFormStepFollowupCondition[],
) => {
  if (!followupConditions) {
    return []
  }

  return followupConditions.map((followupCondition) => {
    const { id, answer, followups } = followupCondition.fields

    return {
      id,
      answer: processAnswer(answer),
      // eslint-disable-next-line
      steps: processSteps(followups),
    }
  })
}

const processType = (type: RawFormStepType) => {
  if (!type) {
    return ''
  }

  const { fields } = type

  return fields.id
}

const processSteps = (steps: RawFormStep[]) => {
  if (!steps) {
    return []
  }

  return steps.map((step) => {
    const {
      id,
      type,
      title,
      navigationTitle,
      description,
      options,
      followupConditions,
    } = step.fields

    return {
      id,
      type: processType(type),
      title,
      navigationTitle: navigationTitle || '',
      description: JSON.stringify(description) || '',
      options: processOptions(options),
      followups: processFollowupConditions(followupConditions),
    }
  })
}

export const processFormResponse = (rawFormResponse: RawForm) => {
  const form = rawFormResponse.items[0]

  const { id, title, description, steps, postFlowContent } = form.fields

  return {
    id,
    title,
    description: JSON.stringify(description) || '',
    steps: processSteps(steps),
    postFlowContent: JSON.stringify(postFlowContent) || '',
  }
}
