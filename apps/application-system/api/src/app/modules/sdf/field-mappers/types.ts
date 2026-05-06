import {
  Application,
  FormText,
  FormTextWithLocale,
  StaticText,
} from '@island.is/application/types'
import { FieldDef } from '@island.is/application/screen-compiler'

import { ComponentDto } from '../dto/screen.dto'
import { FormTextResolver } from '../i18n-resolver.service'

export type ResolvableFormText =
  | FormText
  | FormTextWithLocale
  | StaticText
  | undefined

export type FieldMapperRaw = FieldDef & Record<string, unknown>

export type FieldMapperContext = {
  application: Application
  resolver: FormTextResolver
}

export type FieldMapper = (
  component: ComponentDto,
  raw: FieldMapperRaw,
  context: FieldMapperContext,
) => void
