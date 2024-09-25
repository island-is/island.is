import { defineMessages } from 'react-intl'

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
