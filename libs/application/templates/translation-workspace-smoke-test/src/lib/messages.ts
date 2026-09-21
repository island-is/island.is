import { defineMessages } from 'react-intl'

export const m = defineMessages({
  name: {
    id: 'twst.application:name',
    defaultMessage: '[TEST] Translation Workspace Smoke Test',
    description: `Application's name`,
  },
  actionCardDraft: {
    id: 'twst.application:actionCardDraft',
    defaultMessage: '[TEST] Í vinnslu',
    description: 'Action card status while the application is in draft',
  },
  actionCardDone: {
    id: 'twst.application:actionCardDone',
    defaultMessage: '[TEST] Afgreidd',
    description: 'Action card status once the application is completed',
  },
  draftSectionTitle: {
    id: 'twst.application:draftSectionTitle',
    defaultMessage: '[TEST] Prufuskjár',
    description: 'Section title on the draft screen',
  },
  draftFieldTitle: {
    id: 'twst.application:draftFieldTitle',
    defaultMessage: '[TEST] Þetta er prufustrengur',
    description: 'Title field shown on the draft screen',
  },
  draftFieldDescription: {
    id: 'twst.application:draftFieldDescription',
    defaultMessage:
      '[TEST] Þessi umsókn er aðeins til að prófa þýðingakerfið og er ekki ætluð til notkunar.',
    description: 'Description field shown on the draft screen',
  },
  completedTitle: {
    id: 'twst.application:completedTitle',
    defaultMessage: '[TEST] Prófun lokið',
    description: 'Title shown on the completed screen',
  },
})
