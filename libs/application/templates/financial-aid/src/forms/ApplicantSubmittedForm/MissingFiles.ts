import {
  buildCustomField,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { Routes } from '../../lib/constants'
import { DefaultEvents } from '@island.is/application/types'
import * as m from '../../lib/messages'

export const MissingFiles = buildSection({
  id: Routes.MISSINGFILES,
  title: m.missingFiles.general.pageTitle,
  children: [
    buildMultiField({
      id: Routes.MISSINGFILES,
      title: m.missingFiles.general.pageTitle,
      description: m.missingFiles.general.description,
      children: [
        buildCustomField(
          {
            id: Routes.MISSINGFILES,
            title: m.missingFiles.general.pageTitle,
            component: 'MissingFiles',
          },
          { isSpouse: false },
        ),
        buildSubmitField({
          id: 'missingFilesSubmit',
          title: '',
          actions: [
            {
              event: DefaultEvents.EDIT,
              name: m.missingFiles.general.submit,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
