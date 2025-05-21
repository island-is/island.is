import {
  buildMultiField,
  buildSection,
  buildSelectField,
} from '@island.is/application/core'
import { drivingLicenses } from '../../lib/messages'

export const drivingLicensesSection = buildSection({
  id: 'drivingLicensesSection',
  title: drivingLicenses.general.sectionTitle,
  children: [
    buildMultiField({
      id: 'drivingLicensesMultiField',
      title: drivingLicenses.general.pageTitle,
      description: drivingLicenses.general.description,
      children: [
        buildSelectField({
          id: 'drivingLicenses.drivingLicenseType',
          title: drivingLicenses.labels.drivingLicenseType,
          isMulti: true,
          options: [
            // TODO: get from API
            { value: 'option1', label: 'Veitingastörf' },
            { value: 'option2', label: 'Skrifstofustarf' },
            { value: 'option3', label: 'Þjónustustörf' },
          ],
        }),
        buildSelectField({
          id: 'drivingLicenses.workMachineRights',
          title: drivingLicenses.labels.workMachineRights,
          isMulti: true,
          options: [
            // TODO: get from API
            { value: 'option1', label: 'Veitingastörf' },
            { value: 'option2', label: 'Skrifstofustarf' },
            { value: 'option3', label: 'Þjónustustörf' },
          ],
        }),
      ],
    }),
  ],
})
