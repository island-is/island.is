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
    kindergardenLabel: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.kindergardenLabel',
      defaultMessage: 'Leikskóli',
      description: 'Label for kindergarden input',
    },
    kindergardenPlaceholder: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.kindergardenPlaceholder',
      defaultMessage: 'Í hvaða leikskóla er barnið?',
      description:
        'Placeholder in input where asking about the childs kindergarden name',
    },
    elementarySchoolLabel: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.elementarySchoolLabel',
      defaultMessage: 'Grunnskóli',
      description: 'Label for elementary school input',
    },
    elementarySchoolPlaceholder: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.elementarySchoolPlaceholder',
      defaultMessage: 'Í hvaða grunnskóla er barnið?',
      description:
        'Placeholder in input where asking about the childs elementary school name',
    },
    elementarySchoolFoodCheck: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.elementarySchoolFoodCheck',
      defaultMessage: 'Barnið er skráð í skólamat',
      description:
        'Checkmark to check wheter a child is signed up for food in elementary school',
    },
    elementarySchoolAfterSchoolCheck: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.elementarySchoolAfterSchoolCheck',
      defaultMessage: 'Barnið er í frístund',
      description:
        'Checkmark to check wheter a child is signed up for after school activities in elementary school',
    },
    highSchoolPlaceholder: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.highSchoolPlaceholder',
      defaultMessage: 'Í hvaða framhaldsskóla er barnið?',
      description:
        'Placeholder in input where asking about the childs high school name',
    },
    highSchoolLabel: {
      id: 'fa.application:section.personalInterest.childrenForm.inputs.highSchoolLabel',
      defaultMessage: 'Framhaldsskóli',
      description: 'Label for high school input',
    },
  }),
}
