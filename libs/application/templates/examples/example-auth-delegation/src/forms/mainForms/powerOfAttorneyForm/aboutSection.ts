import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
export const aboutSection = buildSection({
  id: 'aboutSection',
  title: 'Auth Delegation',
  children: [
    buildMultiField({
      id: 'authDelegationFields',
      title: 'Auth delegation',
      children: [
        buildDescriptionField({
          id: 'authDelegationDescription',
          description: (application) => {
            const name = getValueViaPath<string>(
              application.externalData,
              'nationalRegistry.data.fullName',
            )

            return {
              ...m.delegationDescription,
              values: {
                type: 'Power of attorney (Umboð, forsjá, allsherjarumboð)',
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
