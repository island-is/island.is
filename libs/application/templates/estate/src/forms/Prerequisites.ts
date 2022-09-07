import get from 'lodash/get'
import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildExternalDataProvider,
  buildDataProviderItem,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: 'Skilyrði',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conditions',
      title: m.conditionsSection,
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Utanaðkomandi gögn',
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: 'Eitthvað',
              subTitle:
                'Betri lýsing á atriðinu sem er verið að sækja annarsstaðar frá',
            }),
          ],
        }),
        buildMultiField({
          id: 'externalDataSuccess',
          title: 'Tókst að sækja gögn',
          children: [
            buildSubmitField({
              id: 'toDraft',
              placement: 'footer',
              title: 'Hefja umsókn',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Hefja umsókn',
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        buildDescriptionField({
          id: 'neverDisplayed',
          title: '',
          description: '',
        }),
      ],
    }),
    buildSection({
      id: 'intro',
      title: m.introSection,
      children: [],
    }),
    buildSection({
      id: 'career',
      title: m.career,
      children: [],
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [],
    }),
  ],
})
