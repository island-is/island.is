import { Field } from '../types/Fields'
import { Condition } from '../types/Condition'
import {
  Form,
  FormChildren,
  MultiField,
  SubSection,
  Section,
  FormItemTypes,
  RepeaterChildren,
  Repeater,
  SectionChildren,
  SubSectionChildren,
  Schema,
} from '../types/Form'

export function buildForm(data: {
  id: string
  ownerId: string
  name: string
  children: FormChildren[]
  schema: Schema
}): Form {
  return { ...data, type: FormItemTypes.FORM }
}

export function buildMultiField(data: {
  id?: string
  condition?: Condition
  name: string
  children: Field[]
}): MultiField {
  return { ...data, type: FormItemTypes.MULTI_FIELD }
}

export function buildRepeater(data: {
  id?: string
  condition?: Condition
  name: string
  children: RepeaterChildren[]
}): Repeater {
  return { ...data, type: FormItemTypes.REPEATER }
}

export function buildSection(data: {
  id?: string
  condition?: Condition
  name: string
  children: SectionChildren[]
}): Section {
  return { ...data, type: FormItemTypes.SECTION }
}

export function buildSubSection(data: {
  id?: string
  condition?: Condition
  name: string
  children: SubSectionChildren[]
}): SubSection {
  return { ...data, type: FormItemTypes.SUB_SECTION }
}
