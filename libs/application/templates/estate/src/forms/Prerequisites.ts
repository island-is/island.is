import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildRadioField,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { EstateTypes } from '../lib/constants'
import { m } from '../lib/messages'
import { deceasedInfoFields } from './sharedSections/deceasedInfoFields'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesDraft',
  title: '',
  mode: FormModes.DRAFT,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'selectEstate',
      title: '',
      children: [
        buildMultiField({
          id: 'estate',
          title: m.prerequisitesTitle,
          description: m.prerequisitesSubtitle,
          children: [
            ...deceasedInfoFields,
            buildDescriptionField({
              id: 'space1',
              space: 'gutter',
              title: '',
            }),
            buildRadioField({
              id: 'selectedEstate',
              title: '',
              width: 'full',
              options: [
                {
                  value: EstateTypes.estateWithoutAssets,
                  label: EstateTypes.estateWithoutAssets,
                  tooltip: 'Sjá nánar linkur hér',
                },
                {
                  value: EstateTypes.divisionOfEstate,
                  label: EstateTypes.divisionOfEstate,
                  tooltip: 'Sjá nánar linkur hér',
                },
                {
                  value: EstateTypes.permitToPostponeEstateDivision,
                  label: EstateTypes.permitToPostponeEstateDivision,
                  tooltip: 'Sjá nánar linkur hér',
                },
                {
                  value: EstateTypes.divisionOfEstateByHeirs,
                  label: EstateTypes.divisionOfEstateByHeirs,
                  tooltip: 'Sjá nánar linkur hér',
                },
              ],
            }),
            buildSubmitField({
              id: 'estate.submit',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.confirmButton,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
      ],
    }),
  ],
})
