import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  DataProviderBuilderItem,
  Form,
  FormItemTypes,
  FormModes,
} from '@island.is/application/types'

export class PrerequisiteFormBuilder {
  private formDefinition: Form
  private dataProviders: DataProviderBuilderItem[] = []

  constructor(title: string) {
    this.formDefinition = {
      id: 'PrerequisiteForm',
      title,
      mode: FormModes.NOT_STARTED,
      renderLastScreenBackButton: true,
      renderLastScreenButton: true,
      children: [],
      type: FormItemTypes.FORM,
    }
  }

  addExternalDataProvider(...providers: DataProviderBuilderItem[]) {
    this.dataProviders = [...this.dataProviders, ...providers]
    return this
  }

  build() {
    const section = buildSection({
      id: 'externalData',
      title: 'externalData',
      children: [],
    })

    const dataProviders = this.dataProviders.map((provider) =>
      buildDataProviderItem({ provider: provider.provider, ...provider }),
    )

    console.log('dataProviders', dataProviders)
    section.children = [
      buildExternalDataProvider({
        title: 'externalData.title',
        id: 'approveExternalData',
        checkboxLabel: 'externalData.checkboxLabel',
        submitField: buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: 'externalData.submitButtonTitle',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: 'SUBMIT',
              name: 'externalData.submitButtonTitle',
              type: 'primary',
            },
          ],
        }),
        dataProviders,
      }),
    ]

    this.formDefinition.children = [section]
    const form = buildForm(this.formDefinition)
    return JSON.stringify(form) // TODO let template accept Form type
  }
}

export function prerequisitesForm(title: string): PrerequisiteFormBuilder {
  return new PrerequisiteFormBuilder(title)
}
