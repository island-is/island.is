import { ObjectType } from '@nestjs/graphql'

import { InputField } from './inputField.model'

@ObjectType('TaxCalculatorBooleanInputField', { implements: () => InputField })
export class BooleanInputField extends InputField {}
