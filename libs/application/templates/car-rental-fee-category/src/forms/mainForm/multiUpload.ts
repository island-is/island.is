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
  
  export const multiUploadSection = buildSection({
    condition: (answers) => {
      const uploadSelectionValue = getValueViaPath<Array<string>>(
        answers,
        'singleOrMultiSelectionRadio',
      )
  
      return uploadSelectionValue ? uploadSelectionValue[0] === UploadSelection.MULTI : false
    },
    id: 'multiUploadSection',
    title: 'Skrá gjald',
    children: [
      buildMultiField({
        id: 'multiUploadMultiField',
        title: 'Skrá bifreiðar á kílómetragjald eða daggjald',
        children: [
          buildDescriptionField({
            id: 'multiUploadDescription',
            description: 'Veldur þær breytingar sem þú vilt gera', 
          }),
          buildAlertMessageField({
             id: 'multiUploadAlertMessageField',
             alertType: 'info',
             message: '1. Sæktu sniðmátið \n2. Gerðu viðeigandi breytingar á skjalinu \n3. Hleður upp skjalinu hér að neðan'
          }),
          buildDownloadFileButtonField({
            id: 'multiUploadDownloadFileButtonField',
            getFileContent: () => generateExcelSheet(''),
            buttonTitle: 'Sniðmát'
          }),
          buildFileUploadField({
            id: 'multiUploadUploadField',
            uploadHeader: 'Dragðu skjöl hingað til að hlaða upp',
            uploadDescription: 'Tekið er við skjölum með endingu: .csv, .xlsx',
            uploadButtonLabel: 'Hlaða upp skjali',
            uploadAccept: '.csv, .xlsx, xls'
          }),
        ],
      }),
    ],
  })