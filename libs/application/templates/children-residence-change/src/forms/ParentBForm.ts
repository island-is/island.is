import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildTextField,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ParentBForm: Form = buildForm({
  id: 'ParentBForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'backgroundInformation',
      title: m.section.backgroundInformation,
      children: [
        buildTextField({
          id: 'placeholderId',
          title: 'placeholder',
        }),
      ],
    }),
  ],
})
