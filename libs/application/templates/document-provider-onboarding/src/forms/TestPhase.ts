import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  buildSection,
  Form,
} from '@island.is/application/core'
import { m } from './messages'

export const TestPhase: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  ownerId: 'TODO?',
  name: 'Útfærsla og prófanir.',
  children: [
    buildSection({
      id: 'testIntroSection',
      name: m.testIntroSection,
      children: [
        buildIntroductionField({
          id: 'testPhaseIntro',
          name: 'Upplýsingar um prufuaðgang',
          introduction:
            'Notandi fær upplýsingar til að setja inn hjá sér og leiðbeiningar til prófana.',
        }),
      ],
    }),
    buildSection({
      id: 'testSection',
      name: m.testSection,
      children: [
        buildIntroductionField({
          id: 'test',
          name: 'Sjálfvirkar prófanir',
          introduction:
            'Til að fá aðgang að raun, þarf að standast þessar prófanir.. Hér verða sub-sections fyrir hvert próf sem þarf að standast.',
        }),
      ],
    }),
    buildSection({
      id: 'testsFinished',
      name: m.testOutroSection,
      children: [
        buildIntroductionField({
          id: 'overview',
          name: m.overview,
          introduction: m.overviewIntro,
        }),
        buildIntroductionField({
          id: 'final',
          name: 'Takk',
          introduction: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
