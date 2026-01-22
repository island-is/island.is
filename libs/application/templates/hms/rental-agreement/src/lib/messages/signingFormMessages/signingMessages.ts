import { defineMessages } from 'react-intl'

export const signing = defineMessages({
  sectionName: {
    id: 'ra.application:signingForm.sectionName',
    defaultMessage: 'Undirritunarferli',
    description: 'Name of the signing section',
  },
  pageTitle: {
    id: 'ra.application:signingForm.pageTitle',
    defaultMessage: 'Undirritunarferli hafið',
    description: 'Signing page title',
  },
  alertMessageSuccess: {
    id: 'ra.application:signingForm.alertMessageSuccess',
    defaultMessage: 'Samningurinn hefur verið sendur í undirritun',
    description:
      'Success message when the agreement has been sent to Taktikal signatures',
  },
  alertMessageError: {
    id: 'ra.application:signingForm.alertMessageFailed',
    defaultMessage: 'Undirritun mistókst',
    description: 'Error message when the signing failed',
  },
  pageInfoTitle: {
    id: 'ra.application:signingForm.pageInfoTitle',
    defaultMessage: 'Hvað gerist næst?',
    description: 'Title for the signing page info',
  },
  pageInfoDescription: {
    id: 'ra.application:signingForm.pageInfoDescription#markdown',
    defaultMessage:
      '- Allir aðilar samnings fá SMS og tölvupóst með hlekk til að undirrita samninginn rafrænt \n- Hægt er að fylgjast með framvindu undirritunar á Mínum síðum undir Mínar umsóknir \n- Samningur skráist sjálfkrafa í leiguskrá HMS að undirritun lokinni',
    description: 'Description for what comes next in the signing process',
  },
})
