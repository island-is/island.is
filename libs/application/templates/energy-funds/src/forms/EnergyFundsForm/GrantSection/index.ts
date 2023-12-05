import {
  buildAlertMessageField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { information } from '../../../lib/messages/information'
import { Application } from '@island.is/api/schema'
import { grant } from '../../../lib/messages/grant'
import { DefaultEvents } from '@island.is/application/types'
import { VehiclesCurrentVehicle } from '../../../shared/types'
import { EnergyFundsAnswers } from '../../..'

export const GrantSection = buildSection({
  id: 'grant',
  title: grant.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'grantMultiField',
      title: information.labels.bankInformation.title,
      children: [
        buildTextField({
          id: 'grant.grantAmount',
          title: information.labels.bankInformation.grantAmount,
          variant: 'currency',
          readOnly: true,
          defaultValue: (application: Application) => {
            const vehicles = getValueViaPath(
              application.externalData,
              'currentVehicles.data',
              undefined,
            ) as Array<VehiclesCurrentVehicle> | undefined

            const selectedPlate = getValueViaPath(
              application.answers,
              'vehicleDetails.plate',
              undefined,
            ) as string | undefined

            const chosenVehicle: VehiclesCurrentVehicle | undefined = vehicles
              ? vehicles.filter(
                  (x: VehiclesCurrentVehicle) => x.permno === selectedPlate,
                )[0]
              : undefined
            return chosenVehicle ? chosenVehicle.vehicleGrant?.toString() : ''
          },
        }),
        buildDescriptionField({
          id: 'grant.subtitle',
          title: information.labels.bankInformation.accountInfo,
          titleVariant: 'h5',
          space: 'gutter',
        }),
        buildTextField({
          title: information.labels.bankInformation.accountNumer,
          id: 'grant.bankNumber',
          dataTestId: 'bank-account-number',
          readOnly: true,
          format: '####-##-######',
          placeholder: '0000-00-000000',
          defaultValue: (application: Application) =>
            (
              application.externalData.userProfile?.data as {
                bankInfo?: string
              }
            )?.bankInfo,
        }),
        buildAlertMessageField({
          id: 'grant.information',
          title: information.labels.bankInformation.informationTitle,
          message: information.labels.bankInformation.informationDescription,
          alertType: 'info',
        }),
        buildSubmitField({
          id: 'submit',
          placement: 'footer',
          title: grant.general.submit,
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: grant.general.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
