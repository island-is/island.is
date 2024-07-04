import { OmitType } from '@nestjs/swagger'
import { FieldSettingsDto } from './fieldSettings.dto'

export class UpdateFieldSettingsDto extends OmitType(FieldSettingsDto, [
  'list',
] as const) {}
