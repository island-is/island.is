export class Translation {
  formPages: FormPage[]
  version: string
}

export class FormPage {
  id: string
  fields: Record<string, FormItem>
  title: string
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
  available: string
  unAvailable: string
}
