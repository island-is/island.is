import {
  buildDescriptionField,
  buildMultiField,
  buildSelectField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { employmentSearch as employmentSearchMessages } from '../../../lib/messages'

export const drivingLicenseSubSection = buildSubSection({
  id: 'drivingLicenseSubSection',
  title: employmentSearchMessages.drivingLicense.sectionTitle,
  children: [
    buildMultiField({
      id: 'drivingLicenseSubSection',
      title: employmentSearchMessages.drivingLicense.pageTitle,
      description: employmentSearchMessages.drivingLicense.pageDescription,
      children: [
        buildSelectField({
          id: 'drivingLicense.drivingLicenseType',
          title:
            employmentSearchMessages.drivingLicense.drivingLicenseTypeLabel,
          isMulti: true,
          options: (application) => {
            // TODO: get drivingLicenseTypes from externalData when service is ready
            const drivingLicenseTypes = getValueViaPath<{ name: string }[]>(
              application.externalData,
              'drivingLicenseTypes',
            ) ?? [
              {
                name: 'Ökuréttindi B',
              },
              {
                name: 'Ökuréttindi BE',
              },
            ]
            return drivingLicenseTypes.map((type) => ({
              value: type.name,
              label: type.name,
            }))
          },
        }),
        buildSelectField({
          id: 'drivingLicense.workMachineRights',
          title: employmentSearchMessages.drivingLicense.workMachineRights,
          isMulti: true,
          options: (application) => {
            // TODO: get workMachineRights from externalData when service is ready
            const workMachineRights = getValueViaPath<{ name: string }[]>(
              application.externalData,
              'workMachineRights',
            ) ?? [
              {
                name: 'Vinnuvélaréttindi 1',
              },
              {
                name: 'Vinnuvélaréttindi 2',
              },
              {
                name: 'Vinnuvélaréttindi 3',
              },
            ]
            return workMachineRights.map((right) => ({
              value: right.name,
              label: right.name,
            }))
          },
        }),
      ],
    }),
  ],
})
