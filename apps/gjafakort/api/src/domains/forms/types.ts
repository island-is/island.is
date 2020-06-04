import { EntryCollection, Entry } from 'contentful'

interface FormStepOptionValue {
  id: string
}

interface FormStepOption {
  label: string
  value: Entry<FormStepOptionValue>
}

interface FormStepType {
  id: string
}

interface FormStepFollowupConditionAnswer {
  id: string
}

interface FormStepFollowupCondition {
  id: string
  answer: Entry<FormStepFollowupConditionAnswer>
  followups: Entry<FormStep>[]
}

interface FormStep {
  id: string
  type: Entry<FormStepType>
  title: string
  navigationTitle: string
  description: any
  options: Entry<FormStepOption>[]
  followupConditions: Entry<FormStepFollowupCondition>[]
}
interface Form {
  id: string
  title: string
  description: any
  steps: Entry<FormStep>[]
  postFlowContent: any
}

export type RawForm = EntryCollection<Form>
export type RawFormStep = Entry<FormStep>
export type RawFormStepFollowupCondition = Entry<FormStepFollowupCondition>
export type RawFormStepFollowupConditionAnswer = Entry<
  FormStepFollowupConditionAnswer
>
export type RawFormStepType = Entry<FormStepType>
export type RawFormStepOption = Entry<FormStepOption>
export type RawFormStepOptionValue = Entry<FormStepOptionValue>
