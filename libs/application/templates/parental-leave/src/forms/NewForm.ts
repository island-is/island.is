import {
  buildCustomField,
  buildDescriptionField,
  buildFileUploadField,
  buildForm,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../constants'
import {
  inReviewFormMessages, parentalLeaveFormMessages,
} from '../lib/messages'

export const NewForm: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'residentGrantApplication',
      title: 'Dvalarstyrkur',
      children: [
        buildCustomField({
          id: 'residentGrantApplicationInfo',
          title: 'Réttur til dvalarstyrks',
          description: 'Dvalarstyrkur er fjárstyrkur til barnshafandi foreldris sem er nauðsynlegt að mati sérfræðilæknis að dvelja fjarri heimili sínu í tengslum við nauðsynlega þjónustu vegna fæðingar barns, svo sem vegna fjarlægðar, færðar, óveðurs, verkfalls eða áhættumeðgöngu. Styrkurinn er greiddur eftir á.',
          component: 'ResidentGrantApplication',
        }),
        buildCustomField({
          id: 'residentGrantApplicationInfo',
          title: 'Umsókn um dvalarstyrk',
          description: 'Ekki er hægt að sækja um styrkinn fyrr en eftir að barn er fætt. Sækja skal um innan sex mánaða frá fæðingardegi barns.',
          component: 'ResidentGrantApplication',
        }),
        buildCustomField({
          id: 'residentGrantApplicationInfo',
          title: 'Greiðsla dvalarstyrks',
          description: 'Greiðsla dvalarstyrks er innt af hendi eftir fæðingardag barns. Réttur til styrks fellur niður sex mánuðum eftir fæðingardag barns hafi umsókn ekki borist Vinnumálastofnun fyrir þann tíma.',
          component: 'ResidentGrantApplication',
        }),
        buildFileUploadField({
          id: 'fileUpload.selfEmployedFile',
          title: 'Umsókn um dvalarstyrk',
          description: 'File upload',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText:
            '',
          uploadAccept: '.pdf',
          uploadHeader: '',
          uploadDescription: '',
          uploadButtonLabel:
            parentalLeaveFormMessages.selfEmployed.attachmentButton,
        }),
        buildSubmitField({
          id: 'additionalDocumentsSubmit',
          title:
            parentalLeaveFormMessages.attachmentScreen
              .additionalDocumentsEditSubmit,
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              name:
                parentalLeaveFormMessages.attachmentScreen
                  .additionalDocumentsEditSubmit,
              type: 'primary',
              event: 'APPROVE',
            },
          ],
        }),
        buildDescriptionField({
          id: 'unused',
          title: '',
          description: '',
        }),
      ]
    })
  ],
})
