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

export const RevokedForm = buildForm({
  id: 'RevokedForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildMultiField({
      id: 'revokedMultiField',
      title: 'Umsóknin þín',
      children: [
        buildAlertMessageField({
          id: '',
        }),
        buildDividerField({}),
        buildOverviewField({
          id: 'revokedOverview',
          items: getOverviewItems,
        }),
      ],
    }),
  ],
})
