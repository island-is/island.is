import {
  ApplicationTypes,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildSection,
  buildCustomField,
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
        buildCustomField(
          {
            id: 'testPhaseIntro',
            name: 'Umsókn hefur verið samþykkt',
            component: 'TestPhaseInfoScreen',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'testAccountSection',
      name: m.testAccountSection,
      children: [
        buildCustomField(
          {
            id: 'testAccount',
            name: 'Aðgangur að prófunarumhverfi',
            component: 'TestEnvironment',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'testEndPointSection',
      name: m.testEndPointSection,
      children: [
        buildCustomField(
          {
            id: 'endPoint',
            name: 'Upplýsingar um endapunkt umsækjenda',
            component: 'TestEndPoint',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'technicalImplementation',
      name: m.testTechnicalImplementation,
      children: [
        buildCustomField(
          {
            id: 'technicalImplementation',
            name: 'Forritun og prófanir',
            component: 'TechnicalImplementation',
          },
          {},
        ),
      ],
    }),

    buildSection({
      id: 'testSection',
      name: m.testSection,
      children: [
        buildIntroductionField({
          id: 'testSectionIntro',
          name: 'Sjálfvirkar prófanir',
          introduction:
            'Nú þarf þú að útfæra tæknilega útfærslu, smelltu á halda áfram þegar henni er lokið og þú vilt fara í sjálfvirkar prófanir',
        }),
        buildCustomField(
          {
            id: 'test',
            name: 'Sjálfvirkar prófanir',
            component: 'AutomatedTests',
          },
          {},
        ),
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
            buildCustomField(
              {
                id: 'test',
                name: 'Sjálfvirkar prófanir',
                component: 'ProdEnvironment',
              },
              {},
            ),
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
        buildMultiField({
          id: 'finished',
          name: 'Aðgangur að raun',
          description:
            'Þú hefur nú fengið aðgang að umsjónarkerfi skajalveitenda. Það má finna á þínum síðum á ísland.is',
          children: [
            buildCustomField(
              {
                id: 'test',
                name: 'Takk fyrir',
                component: 'ThankYouImage',
              },
              {},
            ),
          ],
        }),
      ],
    }),
  ],
})
