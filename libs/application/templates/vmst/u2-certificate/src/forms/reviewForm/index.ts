import {
  buildAlertMessageField,
  buildDividerField,
  buildForm,
  buildMultiField,
  buildOverviewField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { getOverviewItems } from '../../utils/getOverviewItems'

export const ReviewForm = buildForm({
  id: 'ReviewForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildMultiField({
      id: 'reviewMultiField',
      title: 'Umsóknin þín',
      children: [
        buildAlertMessageField({
          id: 'reviewAlertField',
          alertType: 'info',
        }),
        buildDividerField({}),
        buildOverviewField({
          id: 'reviewOverview',
          items: getOverviewItems,
        }),
      ],
    }),
  ],
})
