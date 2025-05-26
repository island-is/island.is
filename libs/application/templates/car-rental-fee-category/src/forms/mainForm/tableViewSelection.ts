import {
    buildAlertMessageField,
    buildDescriptionField,
    buildDownloadFileButtonField,
    buildFileUploadField,
    buildMultiField,
    buildSection,
    getValueViaPath,
  } from '@island.is/application/core'
import { generateExcelSheet } from '../../utils/generateExcelSheet'
import { UploadSelection } from '../../utils/constants'
  
  export const tableViewSelectionSection = buildSection({
    condition: (answers) => {
      const uploadSelectionValue = getValueViaPath<Array<string>>(
        answers,
        'singleOrMultiSelectionRadio',
      )
  
      return uploadSelectionValue ? uploadSelectionValue[0] === UploadSelection.SINGLE : false
    },
    id: 'tableViewSelectionSection',
    title: 'Skrá gjald',
    children: [
      buildMultiField({
        id: 'tableViewSelectionMultiField',
        title: 'Skrá bifreiðar á kílómetragjald eða daggjald',
        children: [

        ],
      }),
    ],
  })