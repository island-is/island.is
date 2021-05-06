import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildTextField,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const JointChildCustodyForm: Form = buildForm({
  id: 'JointChildCustodyForm',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'jointChildCustody',
      title: 'Sameiginleg forsjá',
      children: [
        buildTextField({
          id: 'applicant.nationalId',
          title: 'Kennitala',
          format: '######-####',
          backgroundColor: 'blue',
        }),
      ],
    }),
  ],
})
