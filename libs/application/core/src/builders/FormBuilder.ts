import {
  Form,
  FormChildren,
  FormItemTypes,
  FormTextWithLocale,
  Section,
  StaticText,
} from '@island.is/application/types'
import { SectionBuilder } from './SectionBuilder'

type FormBuilderOptions = Omit<Form, 'children' | 'id' | 'title' | 'type'>

export class FormBuilder<TSchema = unknown> {
  private legacyForm: Form

  constructor(id: string, title: StaticText, opts?: FormBuilderOptions) {
    this.legacyForm = {
      id,
      title: title ?? '',
      type: FormItemTypes.FORM,
      children: [],
      ...opts,
    }
  }

  addSection(
    id: string,
    title: FormTextWithLocale,
    builderFn: (s: SectionBuilder<TSchema>) => void,
    opts?: Omit<Section, 'children' | 'id' | 'title' | 'type'>,
  ): this {
    const sectionBuilder = new SectionBuilder<TSchema>(id, title, opts)
    builderFn(sectionBuilder)
    ;(this.legacyForm.children as FormChildren[]).push(sectionBuilder.build())
    return this
  }

  addChild(child: FormChildren): this {
    ;(this.legacyForm.children as FormChildren[]).push(child)
    return this
  }

  build(): Form {
    return this.legacyForm
  }
}
