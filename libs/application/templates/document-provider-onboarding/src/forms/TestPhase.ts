import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from './messages'

export const TestPhase: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  name: 'Útfærsla og prófanir.',
  mode: FormModes.APPLYING,
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
        buildMultiField({
          id: 'testsFinishedMulti',
          name: 'Aðgangur að raun',
          description:
            'Hér getur þú búið til aðgang að raunumhverfi. Athugið að afrita og geyma þessar upplýsingar því þær eru ekki geymdar hér í þessari umsókn.',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: 'Senda inn umsókn',

              actions: [
                { event: 'SUBMIT', name: 'Ljúka umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
        buildIntroductionField({
          id: 'finalTestPhase',
          name: 'Takk',
          introduction:
            'Þú hefur nú fengið aðgang að umsjónarkerfi skajalveitenda. Það má finna á þínum síðum á ísland.is',
        }),
      ],
    }),
  ],
})
