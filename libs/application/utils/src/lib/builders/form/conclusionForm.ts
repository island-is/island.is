import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Form,
  FormItemTypes,
  FormModes,
  Section,
} from '@island.is/application/types'

export function conclusionForm(title: string, section: Section): Form {
  const formDefinition: Form = {
    id: 'PrerequisiteForm',
    title,
    mode: FormModes.NOT_STARTED,
    renderLastScreenBackButton: true,
    renderLastScreenButton: true,
    children: [],
    type: FormItemTypes.FORM,
  }

  formDefinition.children = [section]
  const form = buildForm(formDefinition)
  return form
}
