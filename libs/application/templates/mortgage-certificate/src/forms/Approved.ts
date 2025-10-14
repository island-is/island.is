import {
  buildForm,
  buildCustomField,
  buildSection,
  buildMessageWithLinkButtonField,
  coreMessages,
  buildMultiField,
  buildAlertMessageField,
  buildPdfLinkButtonField,
  getValueViaPath,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { DistrictCommissionersLogo } from '@island.is/application/assets/institution-logos'
import { confirmation, externalData, payment, property } from '../lib/messages'
import { SelectedProperty } from '../shared'

export const Approved: Form = buildForm({
  id: 'ApprovedApplicationForm',
  logo: DistrictCommissionersLogo,
  mode: FormModes.COMPLETED,
  children: [
    buildSection({
      id: 'externalData',
      title: externalData.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'selectProperty',
      title: property.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'payment',
      title: payment.general.sectionTitle,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: confirmation.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'confirmationMultiField',
          title: confirmation.labels.confirmation,
          children: [
            buildAlertMessageField({
              id: 'confirmationAlertSuccess',
              alertType: 'success',
              title: confirmation.labels.successTitle,
              message: confirmation.labels.successDescription,
              marginBottom: 3,
              marginTop: 0,
            }),
            buildPdfLinkButtonField({
              id: 'confirmationPdfLinkButtonField',
              verificationDescription: '',
              verificationLinkTitle: '',
              verificationLinkUrl: '',
              getPdfFiles: (application) => {
                const pdfFiles = getValueViaPath(
                  application.externalData,
                  'getMortgageCertificate.data',
                  [],
                ) as {
                  contentBase64: string
                  propertyNumber: string
                }[]
                const properties = getValueViaPath(
                  application.answers,
                  'selectedProperties.properties',
                  [],
                ) as SelectedProperty[]
                return pdfFiles.map(({ contentBase64, propertyNumber }) => {
                  const pdfProperty = properties.find(
                    (property) => property.propertyNumber === propertyNumber,
                  )
                  return {
                    base64: contentBase64,
                    filename: `Veðbókavottorð: ${
                      pdfProperty?.propertyName ?? propertyNumber
                    }`,
                    buttonText: `Veðbókavottorð: ${
                      pdfProperty?.propertyName ?? propertyNumber
                    }`,
                  }
                })
              },
              viewPdfFile: true,
            }),
            buildCustomField({
              component: 'ConfirmationField',
              id: 'confirmationField',
              description: '',
            }),
            buildMessageWithLinkButtonField({
              id: 'uiForms.conclusionBottomLink',
              url: '/minarsidur/umsoknir',
              buttonTitle: coreMessages.openServicePortalButtonTitle,
              message: coreMessages.openServicePortalMessageText,
              marginBottom: [4, 4, 12],
            }),
          ],
        }),
      ],
    }),
  ],
})
