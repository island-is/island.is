import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import Logo from '@island.is/application/templates/family-matters-core/assets/Logo'
import * as m from '../lib/messages'

function rejectedForm(id: string): Form {
  return buildForm({
    id: id,
    title: m.application.name,
    logo: Logo,
    mode: FormModes.REJECTED,
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
