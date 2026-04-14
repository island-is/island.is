import {
  Form,
  FormChildren,
  FormItemTypes,
  FormText,
  StaticText,
} from '@island.is/application/types'
import { SectionBuilder } from './SectionBuilder'

export class FormBuilder<TSchema = unknown> {
  private legacyForm: Form

  constructor(id: string, title: StaticText) {
    this.legacyForm = {
      id,
      title: title ?? '',
      type: FormItemTypes.FORM,
      children: [],
    }
  }

  addSection(
    id: string,
    title: FormText,
    builderFn: (s: SectionBuilder<TSchema>) => void,
  ): this {
    const sectionBuilder = new SectionBuilder<TSchema>(id, title)
    builderFn(sectionBuilder)
    ;(this.legacyForm.children as FormChildren[]).push(sectionBuilder.build())
    return this
  }

  build(): Form {
    return this.legacyForm
  }
}
