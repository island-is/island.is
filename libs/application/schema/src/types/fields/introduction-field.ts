import { BaseField, FieldTypes } from '@island.is/application/schema'

export interface IntroductionField extends BaseField {
  readonly type: FieldTypes.INTRO
  readonly introduction: string
}
