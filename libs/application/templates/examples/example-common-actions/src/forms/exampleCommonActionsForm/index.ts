import { buildForm } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { getDataFromExternalDataSection } from './getDataFromExternalDataSection'
import { validationSection } from './validationSection'
import { clearOnChangeSection } from './clearOnChangeSection'
import { conditionsSection } from './conditionsSection'
import { conditions2Section } from './conditions2Section'
import { overviewSection } from './overviewSection'

export const ExampleCommonActionsForm: Form = buildForm({
  id: 'ExampleCommonActionsForm',
  title: 'Example Common Actions',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    getDataFromExternalDataSection,
    validationSection,
    conditionsSection,
    conditions2Section,
    clearOnChangeSection,
    overviewSection,
  ],
})
