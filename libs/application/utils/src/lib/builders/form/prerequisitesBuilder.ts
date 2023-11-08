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

export function prerequisitesForm(
  title: string,
  providers: DataProviderBuilderItem[],
): string {
  const formDefinition: Form = {
    id: 'PrerequisiteForm',
    title,
    mode: FormModes.NOT_STARTED,
    renderLastScreenBackButton: true,
    renderLastScreenButton: true,
    children: [],
    type: FormItemTypes.FORM,
  }

  const section = buildSection({
    id: 'externalData',
    title: 'externalData',
    children: [],
  })

  const dataProviders = providers.map((provider) =>
    buildDataProviderItem({ provider: provider.provider, ...provider }),
  )

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

  formDefinition.children = [section]
  const form = buildForm(formDefinition)
  return JSON.stringify(form) // TODO let template accept Form type
}
