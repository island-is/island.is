import { defineMessages } from 'react-intl'

export const dataSchema = defineMessages({
  nationalId: {
    id: 'ra.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  phoneNumber: {
    id: 'ra.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
})

export const application = defineMessages({
  name: {
    id: 'ra.application:application.name',
    defaultMessage: 'Leigusamningur',
    description: `Name of rental agreement application`,
  },
})

export const information = {
  general: defineMessages({
    description: {
      id: 'ra.application:information.general.subTitle',
      defaultMessage:
        'Leigusamningur er skráður í Leiguskrá HMS þegar allir aðilar samningsins hafa undirritað rafrænt',
      description: 'Information about the applicant',
    },
  }),
}

export const applicantInfo = {
  general: defineMessages({
    title: {
      id: 'ra.application:applicantInfo.general.title',
      defaultMessage: 'Upplýsingar um leigjanda',
      description: 'Information about the applicant',
    },
  }),
}
