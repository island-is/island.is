import {
  buildForm,
  buildImageField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { FormModes } from '@island.is/application/types'
import { HmsLogo } from '@island.is/application/assets/institution-logos'
import MovingSearching from '../../assets/MovingSearching'
import * as m from '../../lib/messages'

export const noContractsForm = buildForm({
  id: 'noContractsForm',
  logo: HmsLogo,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'noContractsSection',
      tabTitle: m.noContractsMessages.title,
      children: [
        buildMultiField({
          id: 'noContracts',
          title: m.noContractsMessages.title,
          description: m.noContractsMessages.description,
          children: [
            buildImageField({
              id: 'noContractsImage',
              image: MovingSearching,
              marginTop: 4,
            }),
          ],
        }),
      ],
    }),
  ],
})
