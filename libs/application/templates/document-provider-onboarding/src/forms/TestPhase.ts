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
      name: m.testPhaseInfoSection,
      children: [
        buildCustomField({
          id: 'testPhaseInfo',
          name: m.testPhaseInfoTitle,
          component: 'TestPhaseInfoScreen',
        }),
      ],
    }),
    buildSection({
      id: 'testAccountSection',
      name: m.testEnviromentSection,
      children: [
        buildCustomField(
          {
            id: 'testAccount',
            name: m.testEnviromentTitle,
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
            name: m.testEndPointTitle,
            component: 'TestEndPoint',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'technicalImplementation',
      name: m.testTechnicalImplementationSection,
      children: [
        buildCustomField(
          {
            id: 'technicalImplementation',
            name: m.testTechnicalImplementationTitle,
            component: 'TechnicalImplementation',
          },
          {},
        ),
      ],
    }),

    buildSection({
      id: 'testSection',
      name: m.automatedTestsSection,
      children: [
        buildCustomField(
          {
            id: 'test',
            name: m.automatedTestsTitle,
            component: 'AutomatedTests',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'testsFinished',
      name: m.prodEnviromentSection,
      children: [
        buildMultiField({
          id: 'testsFinishedMulti',
          name: m.prodEnviromentTitle,
          description:
            'Hér getur þú búið til aðgang að raunumhverfi. Athugið að afrita og geyma þessar upplýsingar því þær eru ekki geymdar hér í þessari umsókn.',
          children: [
            buildCustomField(
              {
                id: 'prodEnvironment',
                name: 'Aðgangur að raun',
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
