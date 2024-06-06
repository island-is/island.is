import { DefaultEvents } from '@island.is/application/types'

export enum Actions {
  SEND_APPLICATION = 'sendApplication',
}
export const enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
}

export type Events =
  | { type: DefaultEvents.APPROVE }
  | { type: DefaultEvents.REJECT }
  | { type: DefaultEvents.SUBMIT }
  | { type: DefaultEvents.ASSIGN }
  | { type: DefaultEvents.EDIT }

export enum Roles {
  APPLICANT = 'applicant',
}

export type Option = {
  value: string
  label: string
}

export enum RelationOptions {
  GRANDPARENT = 'grandparent',
  SIBLING = 'sibling',
  STEPPARENT = 'stepparent',
  RELATIVE = 'relative',
  FRIEND_OR_OTHER = 'friendOrOther',
}

export enum SiblingRelationOptions {
  SIBLING = 'Sibling',
  HALF_SIBLING = 'halfSibling',
  STEP_SIBLING = 'stepSibling',
}

export enum FoodAllergiesOptions {
  EGG_ALLERGY = 'eggAllergy',
  FISH_ALLERGY = 'fishAllergy',
  PENUT_ALLERGY = 'peanutAllergy',
  WHEAT_ALLERGY = 'wheatAllergy',
  MILK_ALLERGY = 'milkAllergy',
  OTHER = 'other',
}

export enum FoodIntolerancesOptions {
  LACTOSE_INTOLERANCE = 'lactoseIntolerance',
  GLUTEN_INTOLERANCE = 'glutenIntolerance',
  MSG_INTOLERANCE = 'msgIntolerance',
  OTHER = 'other',
}
