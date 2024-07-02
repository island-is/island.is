import { OmitType } from '@nestjs/swagger'
import { FormDto } from './form.dto'

export class UpdateFormDto extends OmitType(FormDto, ['id'] as const) {}
