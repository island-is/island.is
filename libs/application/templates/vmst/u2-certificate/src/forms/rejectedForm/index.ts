import {
  buildAlertMessageField,
  buildDividerField,
  buildForm,
  buildOverviewField,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { DirectorateOfLabourLogo } from '@island.is/application/assets/institution-logos'
import { getOverviewItems } from '../../utils/getOverviewItems'

export const RejectedForm = buildForm({
  id: 'RejctedForm',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  logo: DirectorateOfLabourLogo,
  children: [
    buildAlertMessageField({
      id: 'rejectedAlertField',
      alertType: 'info',
    }),
    buildDividerField({}),
    buildOverviewField({
      id: 'rejectedOverview',
      items: getOverviewItems,
    }),
  ],
})
