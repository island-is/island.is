export class Translation {
  formPages: FormPage[]
  version: string
}

export class FormPage {
  id: string
  fields: Record<string, FormItem>
  title: string
  sectionTitle1: string
  editTitle: string
  help: string
  saveButton: string
  cancelButton: string
}

export class FormItem {
  label: string
  placeholder: string
  helpText: string
  errorMessage: string
  available?: string
  unAvailable?: string
  selectItems: Record<string, SelectField>
  popUpTitle?: string
  popUpDescription?: string
}

export class SelectField {
  helpText: string
  selectItemText: string
  flow?: string
}
