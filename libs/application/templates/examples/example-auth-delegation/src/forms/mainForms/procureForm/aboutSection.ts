import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
export const aboutSection = buildSection({
  id: 'aboutSection',
  title: 'Auth delegation',
  children: [
    buildMultiField({
      id: 'procureFields',
      title: 'Auth delegation',
      children: [
        buildDescriptionField({
          id: 'procureDescription',
          description: (application) => {
            const name = getValueViaPath<string>(
              application.externalData,
              'identity.data.name',
            )

            const type = getValueViaPath<string>(
              application.externalData,
              'identity.data.type',
            )

            return {
              ...m.delegationDescription,
              values: {
                type,
                name: name,
                applicantNationalId: application.applicant ?? '1234567890',
                actors: application.applicantActors?.join(', '),
              },
            }
          },
        }),
      ],
    }),
  ],
})
