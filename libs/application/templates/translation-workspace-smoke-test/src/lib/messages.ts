import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'twst.application:name',
    defaultMessage: '[TEST] Translation Workspace Smoke Test',
    description: `Application's name`,
  },
  actionCardPrerequisite: {
    id: 'twst.application:actionCardPrerequisite',
    defaultMessage: '[TEST] Í vinnslu',
    description: 'Action card status while the application is in prerequisite',
  },
  actionCardDone: {
    id: 'twst.application:actionCardDone',
    defaultMessage: '[TEST] Afgreidd',
    description: 'Action card status once the application is completed',
  },
  prerequisiteSectionTitle: {
    id: 'twst.application:prerequisiteSectionTitle',
    defaultMessage: '[TEST] Prufuskjár',
    description: 'Section title on the prerequisite screen',
  },
  prerequisiteFieldTitle: {
    id: 'twst.application:prerequisiteFieldTitle',
    defaultMessage: '[TEST] Þetta er prufustrengur',
    description: 'Title field shown on the prerequisite screen',
  },
  prerequisiteFieldDescription: {
    id: 'twst.application:prerequisiteFieldDescription',
    defaultMessage:
      '[TEST] Þessi umsókn er aðeins til að prófa þýðingakerfið og er ekki ætluð til notkunar.',
    description: 'Description field shown on the prerequisite screen',
  },
  completedTitle: {
    id: 'twst.application:completedTitle',
    defaultMessage: '[TEST] Prófun lokið',
    description: 'Title shown on the completed screen',
  },
  actionCardMain: {
    id: 'twst.application:actionCardMain',
    defaultMessage: '[TEST] Í vinnslu',
    description:
      'Action card status while the application is on the main screen',
  },
  mainSectionTitle: {
    id: 'twst.application:mainSectionTitle',
    defaultMessage: '[TEST] Spurningaskjár',
    description: 'Section title on the main screen',
  },
  mainRadioTitle: {
    id: 'twst.application:mainRadioTitle',
    defaultMessage: '[TEST] Veldu einn valkost',
    description: 'Title for the radio field on the main screen',
  },
  mainRadioOptionOneLabel: {
    id: 'twst.application:mainRadioOptionOneLabel',
    defaultMessage: '[TEST] Valkostur 1',
    description: 'Label for the first radio option on the main screen',
  },
  mainRadioOptionTwoLabel: {
    id: 'twst.application:mainRadioOptionTwoLabel',
    defaultMessage: '[TEST] Valkostur 2',
    description: 'Label for the second radio option on the main screen',
  },
  mainMarkdownDescription: {
    id: 'twst.application:mainMarkdownDescription',
    defaultMessage:
      '[TEST] Þetta er **markdown** texti með _skáletrun_ og lista:\n- Fyrsti liður\n- Annar liður\n\nSjá nánar á [island.is](https://island.is).',
    description: 'Markdown text shown on the main screen',
  },
})
