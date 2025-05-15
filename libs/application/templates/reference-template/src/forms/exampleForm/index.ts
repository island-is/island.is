import { createElement } from 'react'
import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildRedirectToServicePortalField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { ApiActions } from '../../shared'
import { introSection } from './introSection/introSection'
import { simpleInputsSection } from './simpleInputsSection'
import { compositeFieldsSection } from './compositeFieldsSection'
import { commonActionsSection } from './commonActionsSection'
import { customSection } from './customSection/customSection'
import { overviewSection } from './overviewSection/overviewSection'
import { noInputFieldsSection } from './noInputFieldsSection'
import { Logo } from '../../components/Logo/Logo'
import { tablesAndRepeatersSection } from './tablesAndRepeatersSection'
import { m } from '../../lib/messages'

export const ExampleForm: Form = buildForm({
  id: 'ExampleFormDraft',
  title: 'Main form',
  mode: FormModes.DRAFT,
  // The logo prop can either take in a React component or a function that returns a React component.
  // Dynamic logo can be based on answers or external data
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
  children: [
    introSection,
    commonActionsSection,
    noInputFieldsSection,
    simpleInputsSection,
    compositeFieldsSection,
    tablesAndRepeatersSection,
    customSection,
    overviewSection,
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [
        buildMultiField({
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'Senda inn umsókn',
              actions: [
                { event: 'SUBMIT', name: 'Senda inn umsókn', type: 'primary' },
              ],
            }),
            buildDescriptionField({
              id: 'overview',
              title: 'Thank you for applying',
              description:
                'By clicking "Submit" below, the application will be sent for processing. We will let you know when it is accepted or rejected.',
            }),
          ],
        }),
        buildRedirectToServicePortalField({
          id: 'redirect',
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: (application) => {
            const sendApplicationActionResult =
              application.externalData[ApiActions.createApplication]

            let id = 'unknown'
            if (sendApplicationActionResult) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              id = sendApplicationActionResult.data.id
            }

            return {
              ...m.outroMessage,
              values: {
                id,
              },
            }
          },
        }),
      ],
    }),
  ],
})
