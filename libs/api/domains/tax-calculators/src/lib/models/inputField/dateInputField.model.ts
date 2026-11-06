import { ObjectType } from '@nestjs/graphql'

import { InputField } from './inputField.model'

@ObjectType('TaxCalculatorDateInputField', { implements: () => InputField })
export class DateInputField extends InputField {}
