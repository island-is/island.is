import {
  buildForm,
  buildMultiField,
  buildSection,
  buildCustomField,
  buildSubmitField,
} from '@island.is/application/core'
import { ApplicationTypes, Form, FormModes } from '@island.is/application/types'
import { m } from './messages'

export const TestPhase: Form = buildForm({
  id: ApplicationTypes.DOCUMENT_PROVIDER_ONBOARDING,
  title: 'Útfærsla og prófanir',
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'testIntroSection',
      title: m.testPhaseInfoSection,
      children: [
        buildCustomField({
          id: 'testPhaseInfo',
          title: m.testPhaseInfoTitle,
          component: 'TestPhaseInfoScreen',
        }),
      ],
    }),
    buildSection({
      id: 'testAccountSection',
      title: m.testEnviromentSection,
      children: [
        buildCustomField(
          {
            id: 'testProviderId',
            title: m.testEnviromentTitle,
            component: 'TestEnvironment',
          },
          {},
        ),
      ],
    }),
    buildSection({
      id: 'testEndPointSection',
      title: m.testEndPointSection,
      children: [
        buildCustomField({
          id: 'endPointObject',
          title: m.testEndPointTitle,
          component: 'TestEndPoint',
        }),
      ],
    }),
    buildSection({
      id: 'technicalImplementation',
      title: m.testTechnicalImplementationSection,
      children: [
        buildCustomField({
          id: 'technicalAnswer',
          title: m.testTechnicalImplementationTitle,
          component: 'TechnicalImplementation',
        }),
      ],
    }),

    buildSection({
      id: 'testSection',
      title: m.automatedTestsSection,
      children: [
        buildCustomField({
          id: 'test',
          title: m.automatedTestsTitle,
          component: 'AutomatedTests',
        }),
      ],
    }),
    buildSection({
      id: 'testsFinished',
      title: m.prodEnviromentSection,
      children: [
        buildMultiField({
          id: 'testsFinishedMulti',
          title: m.prodEnviromentTitle,
          description: m.prodEnviromentsubTitle,
          children: [
            buildCustomField(
              {
                id: 'prodProviderId',
                title: 'Aðgangur að raun',
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
      title: m.prodEndPointSection,
      children: [
        buildMultiField({
          id: 'prodEndPointSection',
          title: m.prodEndPointSection,
          children: [
            buildCustomField({
              id: 'endPoint',
              title: m.prodEndPointTitle,
              component: 'ProdEndPoint',
            }),
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Senda inn umsókn',

              actions: [
                { event: 'SUBMIT', name: 'Ljúka umsókn', type: 'primary' },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'finished',
          title: m.thankYouImageScreenTitle,
          description: m.thankYouImageScreenScreenSubTitle,
          children: [
            buildCustomField(
              {
                id: 'thankYouImage',
                title: m.thankYouImageScreenTitle,
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
