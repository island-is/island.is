import {
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

    return uploadSelectionValue
      ? uploadSelectionValue === UploadSelection.SINGLE
      : false
  },
  id: 'tableViewSelectionSection',
  title: m.tableView.sectionTitle,
  children: [
    buildMultiField({
      id: 'tableViewSelectionMultiField',
      title: m.tableView.multiTitle,
      children: [],
    }),
  ],
})
