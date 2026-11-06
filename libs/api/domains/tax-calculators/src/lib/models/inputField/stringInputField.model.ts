import { ObjectType } from '@nestjs/graphql'

import { InputField } from './inputField.model'

@ObjectType('TaxCalculatorStringInputField', { implements: () => InputField })
export class StringInputField extends InputField {}
