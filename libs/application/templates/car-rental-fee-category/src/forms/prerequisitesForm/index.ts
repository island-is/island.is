import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, FormModes } from '@island.is/application/types'
import { SkatturApi, VehiclesApi } from '../../dataProviders'
import { m } from '../../lib/messages'
import { endOfMonthCheck } from '../mainForm/endOfMonthCheck'
import { areLessThan7DaysLeftOfMonth } from '../../utils/dayRateUtils'

const standardChildren = [
  buildSection({
    id: 'conditions',
    tabTitle: m.prerequisites.tabTitle,
    children: [
      buildExternalDataProvider({
        id: 'approveExternalData',
        title: m.prerequisites.title,
        checkboxLabel: m.prerequisites.approvalCheckboxLabel,
        dataProviders: [
          buildDataProviderItem({
            provider: SkatturApi, // Skatturinn
            title: m.prerequisites.skatturTitle,
            subTitle: m.prerequisites.skatturSubTitle,
          }),
          buildDataProviderItem({
            provider: VehiclesApi, // Samgöngustofan
            title: m.prerequisites.vehiclesTitle,
            subTitle: m.prerequisites.vehiclesSubTitle,
          }),
        ],
        submitField: buildSubmitField({
          id: 'submit',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.prerequisites.confirmButton,
              type: 'primary',
            },
          ],
        }),
      }),
    ],
  }),
]

const tooFewDaysLeftChildren = [endOfMonthCheck]

export const Prerequisites = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: !areLessThan7DaysLeftOfMonth()
    ? tooFewDaysLeftChildren
    : standardChildren,
})
