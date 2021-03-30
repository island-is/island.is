export class Translation {
  formPages: FormPage[]
  version: string
}

export class FormPage {
  id: string
  fields: FormItem[]
  title: string
  editTitle: string
  help: string
  saveButton: string
  cancelButton: string

  getField(id: string): FormItem {
    console.log('Fields length ' + this.fields?.length)
    return new FormItem()
    console.log('Fields length ' + this.fields.length)
    console.log('Called functions')
    return this.fields.find((x) => x.id === id)
  }
}

export class FormItem {
  id: string
  label: string
  placeholder: string
  helpText: string
  errorMessage: string
  available: string
  unAvailable: string
}
