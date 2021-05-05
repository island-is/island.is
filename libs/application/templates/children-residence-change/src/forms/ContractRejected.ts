import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import Logo from '../../assets/Logo'
import * as m from '../lib/messages'

export const ParentBContractRejected: Form = buildForm({
  id: 'ParentBContractRejected',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'ParentBContractRejected',
      title: m.contractRejected.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'ParentBContractRejected',
          title: m.contractRejected.general.pageTitle,
          component: 'ParentBContractRejected',
        }),
      ],
    }),
  ],
})

export const ContractRejected: Form = buildForm({
  id: 'ContractRejected',
  title: m.application.name,
  logo: Logo,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'contractRejected',
      title: m.contractRejected.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'contractRejected',
          title: m.contractRejected.general.pageTitle,
          component: 'ContractRejected',
        }),
      ],
    }),
  ],
})
