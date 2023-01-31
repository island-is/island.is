import {
  buildCustomField,
  buildFileUploadField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form } from '@island.is/application/types'

import Logo from '../assets/Logo'
import { FILE_SIZE_LIMIT } from '../constants'
import {
  inReviewFormMessages,
  parentalLeaveFormMessages,
} from '../lib/messages'
import { residentGrantIsOpenForApplication } from '../lib/parentalLeaveUtils'

export const ResidenceGrant: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'residentGrantApplication',
      title: '',
      children: [
        buildCustomField({
          id: 'residenceGrantApplication',
          title: 'Réttur til dvalarstyrks',
          description: '',
          defaultValue: 'rights',
          component: 'ResidenceGrantApplication',
        }),
        buildCustomField({
          id: 'residenceGrantApplication',
          title: 'Umsókn um dvalarstyrk',
          description:
            'Ekki er hægt að sækja um styrkinn fyrr en eftir að barn er fætt. Sækja skal um innan sex mánaða frá fæðingardegi barns.',
          defaultValue: 'apply',
          component: 'ResidenceGrantApplication',
        }),
        buildCustomField({
          id: 'residenceGrantApplication',
          title: 'Greiðsla dvalarstyrks',
          description:
            'Greiðsla dvalarstyrks er innt af hendi eftir fæðingardag barns. Réttur til styrks fellur niður sex mánuðum eftir fæðingardag barns hafi umsókn ekki borist Vinnumálastofnun fyrir þann tíma.',
          defaultValue: 'payment',
          component: 'ResidenceGrantApplication',
        }),
        buildFileUploadField({
          condition: (application) => {
            const { dateOfBirth } = application
            if (
              dateOfBirth &&
              residentGrantIsOpenForApplication(`${dateOfBirth}`)
            )
              return true
            return false
          },
          id: 'fileUpload.dvalarstyrk',
          title: 'Umsókn um dvalarstyrk',
          description: 'File upload',
          maxSize: FILE_SIZE_LIMIT,
          maxSizeErrorText: '',
          uploadAccept: '.pdf',
          uploadHeader: 'Hladdu inn umsókn þinni hér',
          uploadDescription: '',
          uploadButtonLabel:
            parentalLeaveFormMessages.selfEmployed.attachmentButton,
        }),
        buildCustomField({
          id: 'residenceGrantApplication',
          defaultValue: 'submit',
          title: '',
          description: '',
          component: 'ResidenceGrantApplication',
        }),
      ],
    }),
  ],
})
