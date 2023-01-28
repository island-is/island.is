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
  inReviewFormMessages, parentalLeaveFormMessages,
} from '../lib/messages'
import { residentGrantIsOpenForApplication } from '../lib/parentalLeaveUtils'

export const ResidenceGrantOpen: Form = buildForm({
  id: 'ParentalLeaveInReview',
  title: inReviewFormMessages.formTitle,
  logo: Logo,
  children: [
    buildSection({
      id: 'residentGrantApplication',
      title: 'Dvalarstyrkur',
      children: [
        buildCustomField({
          id: 'residenceGrantApplication',
          title: 'Réttur til dvalarstyrks',
          description: 'Dvalarstyrkur er fjárstyrkur til barnshafandi foreldris sem er nauðsynlegt að mati sérfræðilæknis að dvelja fjarri heimili sínu í tengslum við nauðsynlega þjónustu vegna fæðingar barns, svo sem vegna fjarlægðar, færðar, óveðurs, verkfalls eða áhættumeðgöngu. Styrkurinn er greiddur eftir á.',
          defaultValue: 'notVisible',
          component: 'ResidenceGrantApplication',
        }),
        buildCustomField({
          id: 'residenceGrantApplication',
          title: 'Umsókn um dvalarstyrk',
          description: 'Ekki er hægt að sækja um styrkinn fyrr en eftir að barn er fætt. Sækja skal um innan sex mánaða frá fæðingardegi barns.',
          defaultValue: 'notVisible',
          component: 'ResidenceGrantApplication',
        }),
        buildCustomField({
          id: 'residenceGrantApplication',
          title: 'Greiðsla dvalarstyrks',
          description: 'Greiðsla dvalarstyrks er innt af hendi eftir fæðingardag barns. Réttur til styrks fellur niður sex mánuðum eftir fæðingardag barns hafi umsókn ekki borist Vinnumálastofnun fyrir þann tíma.',
          defaultValue: 'notVisible',
          component: 'ResidenceGrantApplication',
        }),
        buildFileUploadField({
          condition: (application) => {
            const { dateOfBirth } = application
            if (dateOfBirth && residentGrantIsOpenForApplication(`${dateOfBirth}`)) return true
            return false
          },
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
        buildCustomField({
          id: 'residenceGrantApplication',
          condition: (application) => {
            const { dateOfBirth } = application
            if (dateOfBirth && residentGrantIsOpenForApplication(`${dateOfBirth}`)) return false
            return true
          },
          defaultValue: 'visible',
          title: 'Umsóknin er ekki opin ennþá',
          description: 'Þegar þú getur sótt um dvalarstyrk. Þú getur sótt um á þessari síðu.',
          component: 'ResidenceGrantApplication',
        }),
      ]
    })
  ],
})
