import { Field } from '../types/Fields'
import { Condition } from '../types/Condition'
import {
  Form,
  FormChildren,
  MultiField,
  SubSection,
  Section,
  FormItemTypes,
  FormLeaf,
  Repeater,
  SectionChildren,
  Schema,
} from '../types/Form'
import { FormType } from '../forms'

export function buildForm(data: {
  id: FormType
  ownerId: string
  name: string
  children: FormChildren[]
  schema: Schema
  icon?: string
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
  children: FormLeaf[]
}): Repeater {
  return { ...data, type: FormItemTypes.REPEATER, repetitions: 0 }
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
  children: FormLeaf[]
}): SubSection {
  return { ...data, type: FormItemTypes.SUB_SECTION }
}
