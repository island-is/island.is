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
            id: 'testProviderId',
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
            id: 'endPointObject',
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
            id: 'technicalAnswer',
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
          description: m.prodEnviromentsubTitle,
          children: [
            buildCustomField(
              {
                id: 'prodProviderId',
                name: 'Aðgangur að raun',
                component: 'ProdEnvironment',
              },
              {},
            ),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'prodEndPointSection',
      name: m.prodEndPointSection,
      children: [
        buildMultiField({
          id: 'prodEndPointSection',
          name: m.prodEndPointSection,
          children: [
            buildCustomField(
              {
                id: 'endPoint',
                name: m.prodEndPointTitle,
                component: 'ProdEndPoint',
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
          name: m.thankYouImageScreenTitle,
          description: m.thankYouImageScreenScreenSubTitle,
          children: [
            buildCustomField(
              {
                id: 'thankYouImage',
                name: m.thankYouImageScreenTitle,
                component: 'WomanWithLaptopIllustrationPeriods',
              },
              {},
            ),
          ],
        }),
      ],
    }),
  ],
})
