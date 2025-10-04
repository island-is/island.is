import {
  buildForm,
  buildSection,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import * as m from '../lib/messages'

const rejectedForm = (id: string): Form => {
  return buildForm({
    id: id,
    title: m.application.name,
    logo: DistrictCommissionersLogo,
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
