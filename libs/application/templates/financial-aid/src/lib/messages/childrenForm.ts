import { defineMessages } from 'react-intl'

export const childrenForm = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.personalInterest.childrenForm.general.sectionTitle',
      defaultMessage: 'Börn',
      description: 'About form section title',
    },
    pageTitle: {
      id: 'fa.application:section.personalInterest.childrenForm.general.pageTitle',
      defaultMessage: 'Börn',
      description: 'About form page title',
    },
    description: {
      id: 'fa.application:section.personalInterest.childrenForm.general.description',
      defaultMessage:
        'Samkvæmt upplýsingum frá Þjóðskrá ert þú með börn á þínu framfæri.',
      description: 'About form page description',
    },
  }),
  page: defineMessages({
    content: {
      id: 'fa.application:section.personalInterest.childrenForm.page.content#markdown',
      defaultMessage:
        'Hér getur þú skráð leikskóla, grunn– eða framhaldsskóla barnanna og hvort þau séu í frístund eða með skólamat.',
      description: 'About school for children',
    },
    birthday: {
      id: 'fa.application:section.personalInterest.childrenForm.page.birthday',
      defaultMessage: 'Fæðingardagur {birthday}',
      description: 'Text before birthday',
    },
  }),
  inputs: defineMessages({
    schoolLabel: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.schoolLabel',
      defaultMessage: 'Skóli',
      description: 'Label for school input',
    },
    schoollPlaceholder: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.schoollPlaceholder',
      defaultMessage: 'Í hvaða skóla er barnið?',
      description:
        'Placeholder in input where asking about the childs school name',
    },
    commentLabel: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.commentLabel',
      defaultMessage: 'Auka upplýsingar',
      description: 'Label for comment about children',
    },
    commentPlaceholder: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.commentPlaceholder',
      defaultMessage: 'm.a. frístund eða skólamatur',
      description: 'Placeholder for comment about children',
    },
  }),
}
