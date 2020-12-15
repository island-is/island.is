import { FieldBaseProps } from '@island.is/application/core'

export enum StatusTypes {
  PENSIONER = 'pensioner',
  STUDENT = 'student',
  OTHER = 'other',
  EMPLOYED = 'employed',
}

export interface ReviewFieldProps extends FieldBaseProps {
  isEditable: boolean
}