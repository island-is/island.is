import { IsJSON } from 'class-validator'

export class ValueType {}

export class StringType extends ValueType {
  @IsJSON()
  value!: string
}
