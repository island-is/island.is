import {
  buildMultiField,
  buildSubSection,
  buildCustomField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages'
import { Routes } from '../../../lib/constants'
import { ApplicantResidenceConditionViewModel } from '@island.is/clients/directorate-of-immigration'

export const ParentsSubSection = buildSubSection({
  id: Routes.PARENTINFORMATION,
  title: information.labels.parents.subSectionTitle,
  condition: (_, externalData) => {
    const residenceConditionInfo = getValueViaPath(
      externalData,
      'residenceConditionInfo.data',
      {},
    ) as ApplicantResidenceConditionViewModel
    const isAnyResConValid = residenceConditionInfo.isAnyResConValid

    // TODO revert
    // return !isAnyResConValid
    return true
  },
  children: [
    buildMultiField({
      id: Routes.PARENTINFORMATION,
      title: information.labels.parents.pageTitle,
      children: [
        buildCustomField({
          id: 'parentInformation',
          title: '',
          description: '',
          component: 'Parents',
        }),
      ],
    }),
  ],
})
