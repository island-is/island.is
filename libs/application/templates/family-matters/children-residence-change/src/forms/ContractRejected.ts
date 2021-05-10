import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import Logo from '../../../assets/Logo'
import * as m from '../lib/messages'

function rejectedForm(id: string): Form {
  return buildForm({
    id: id,
    title: m.application.name,
    logo: Logo,
    mode: FormModes.APPLYING,
    children: [
      buildSection({
        id: id,
        title: m.contractRejected.general.sectionTitle,
        children: [
          buildCustomField({
            id: id,
            title: m.contractRejected.general.pageTitle,
            component: id,
          }),
        ],
      }),
    ],
  })
}

export const ParentBContractRejected = rejectedForm('ParentBContractRejected')

export const ContractRejected = rejectedForm('ContractRejected')
