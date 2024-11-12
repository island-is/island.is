import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildRedirectToServicePortalField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { ApiActions } from '../../shared'
import { introSection } from './introSection/introSection'
import { simpleInputsSection } from './simpleInputsSection'
import { descriptionSection } from './descriptionSection/descriptionSection'
import { accordionSection } from './accordionSection/accordionSection'
import { tableRepeaterSection } from './tableRepeaterSection/tableRepeaterSection'
import { staticTableSection } from './staticTableSection/StaticTableSection'
import { actionCardSection } from './actionCardSection/actionCardSection'
import { compositeFieldsSection } from './compositeFieldsSection'
import { createElement } from 'react'
import { Logo } from '../../components/Logo/Logo'
import { dividerSection } from './dividerSection/dividerSection'
import { keyValueSection } from './keyValueSection/keyValueSection'
import { commonActionsSection } from './commonActionsSection'
import { customSection } from './customSection/customSection'
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
    descriptionSection,
    dividerSection,
    simpleInputsSection,
    compositeFieldsSection,
    accordionSection,
    tableRepeaterSection,
    staticTableSection,
    actionCardSection,
    keyValueSection,
    customSection,
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [
        buildMultiField({
          title: '',
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
              title: 'Takk fyrir að sækja um',
              description:
                'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
            }),
          ],
        }),
        buildRedirectToServicePortalField({
          id: 'redirect',
          title: '',
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
