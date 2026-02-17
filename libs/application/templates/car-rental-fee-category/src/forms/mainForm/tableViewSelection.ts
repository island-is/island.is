import {
  buildCustomField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { UploadSelection } from '../../utils/constants'
import { m } from '../../lib/messages'

export const tableViewSelectionSection = buildSection({
  condition: (answers) => {
    const uploadSelectionValue =
      getValueViaPath<string>(answers, 'singleOrMultiSelectionRadio') ??
      UploadSelection.MULTI

    return uploadSelectionValue === UploadSelection.SINGLE
  },
  id: 'tableViewSelectionSection',
  title: m.tableView.sectionTitle,
  children: [
    buildMultiField({
      id: 'tableViewSelectionMultiField',
      title: m.tableView.multiTitle,
      children: [
        buildCustomField({
          id: 'vehicleMileageSearchTableField',
          component: 'VehicleMileageSearchTable',
          doesNotRequireAnswer: true,
          childInputIds: ['vehicleLatestMilageRows'],
        }),
      ],
    }),
  ],
})
