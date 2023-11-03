import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export class FormBuilder {
  private formDefinition: Form

  constructor(id: string, title: string, mode: FormModes) {
    this.formDefinition = buildForm({
      id,
      title,
      mode,
      renderLastScreenBackButton: true,
      renderLastScreenButton: true,
      children: [],
    })
  }
}
