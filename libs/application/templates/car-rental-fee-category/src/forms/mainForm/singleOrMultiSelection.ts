import {
  buildDescriptionField,
  buildMultiField,
  buildRadioField,
  buildSection,
} from '@island.is/application/core'
import { UploadSelection } from '../../utils/constants'

export const singleOrMultiSelection = buildSection({
  id: 'singleOrMultiSelectionSection',
  title: 'Fjöldi skráninga',
  children: [
    buildMultiField({
      id: 'singleOrMultiSelectionMultiField',
      title: 'Magnskráning eða stakir bílar',
      children: [
        buildDescriptionField({
          id: 'singleOrMultiSelectionDescription',
          description: 'Veldu magnskráningu eða stakskráningu.',
        }),

        buildRadioField({
          id: 'singleOrMultiSelectionRadio',
          required: true,
          options: [
            {
              label: 'Magnskráning',
              subLabel:
                'Hér má hlaða upp .xlsx eða .csv skjali til að magnskrá breytingar á gjaldflokki og kílómetrastöðu.',
              value: UploadSelection.MULTI,
            },
            {
              label: 'Skrá staka bíla',
              subLabel:
                'Þú getur skráð upplýsingar um gjaldflokk og kílómetrastöðu beint í gegnum viðmótið.',
              value: UploadSelection.SINGLE,
              disabled: true,
            },
          ],
        }),
      ],
    }),
  ],
})
