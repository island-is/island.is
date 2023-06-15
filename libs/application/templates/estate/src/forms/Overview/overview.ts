import {
  buildMultiField,
  buildSection,
  buildSubmitField,
  getValueViaPath,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { commonOverviewFields } from './commonFields'
import { overviewAssetsAndDebts } from './overviewAssetsAndDebts'
import { overviewAttachments } from './overviewAttachments'
import { overviewConfirmAction } from './overviewConfirmAction'
import { EstateTypes, YES, NO } from '../../lib/constants'

export const overview = buildSection({
  id: 'overviewEstateDivision',
  title: m.overviewTitle,
  children: [
    buildMultiField({
      id: 'overviewEstateDivision',
      title: m.overviewTitle,
      description: m.overviewSubtitlePermitToPostpone,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? getValueViaPath(
              answers,
              'estateWithoutAssets.estateAssetsExist',
            ) === YES
          : true,
      children: [
        ...commonOverviewFields,
        ...overviewAssetsAndDebts,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
    buildMultiField({
      id: 'overviewWithoutAssets',
      title: m.overviewTitle,
      description: m.overviewSubtitlePermitToPostpone,
      condition: (answers) =>
        getValueViaPath(answers, 'selectedEstate') ===
        EstateTypes.estateWithoutAssets
          ? getValueViaPath(
              answers,
              'estateWithoutAssets.estateAssetsExist',
            ) === NO
          : false,
      children: [
        ...commonOverviewFields,
        ...overviewAttachments,
        ...overviewConfirmAction,
        buildSubmitField({
          id: 'estateDivisionSubmit.submit',
          title: '',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
