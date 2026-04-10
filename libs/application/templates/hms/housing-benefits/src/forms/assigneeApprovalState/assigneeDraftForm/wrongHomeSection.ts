import {
  buildCheckboxField,
  buildDescriptionField,
  buildHiddenInput,
  buildMultiField,
  buildSection,
  buildImageField,
} from '@island.is/application/core'
import { HandShake } from '@island.is/application/assets/graphics'
import * as m from '../../../lib/messages'
import { shouldShowRefetchNationalRegistrySection } from '../../../utils/conditions'

export const wrongHomeSection = buildSection({
  condition: (answers) => {
    console.log('answers: ', answers)
    return true
  },
  id: 'wrongHomeSection',
  title: m.assigneeDraft.wrongHomeTitle,
  children: [
    buildMultiField({
      id: 'wrongHome',
      title: m.assigneeDraft.wrongHomeMultiFieldTitle,
      description: m.assigneeDraft.wrongHomeDescription,
      children: [
        buildDescriptionField({
          id: 'wrongHome.reason2',
          description: m.assigneeDraft.wrongHomeDescription2,
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'wrongHome.reason3',
          description: m.assigneeDraft.wrongHomeDescription3,
          marginBottom: 6,
        }),
        buildImageField({
          id: 'wrongHome.image',
          image: HandShake,
          marginBottom: 4,
        }),
        buildDescriptionField({
          id: 'wrongHome.shouldRefetchNationalRegistryDescription',
          description: m.assigneeDraft.wrongHomeDescription4,
          marginBottom: 6,
        }),
        buildCheckboxField({
          id: 'wrongHome.addressUpdated',
          title: '',
          options: [
            {
              value: 'confirmed',
              label: m.assigneeDraft.wrongHomeCheckboxLabel,
            },
          ],
          clearOnChange: (application) => {
            const answers = application.answers as Record<string, any>
            const signed = (answers.householdMemberApprovals ?? []) as string[]
            const suffixes = [
              'assigneeInfo.name',
              'assigneeInfo.nationalId',
              'assigneeInfo.address',
              'assigneeInfo.postalCode',
              'assigneeInfo.city',
              'assigneeInfo.email',
              'assigneeInfo.phoneNumber',
            ]

            const paths: string[] = []
            for (const topKey of Object.keys(answers)) {
              if (answers[topKey]?.assigneeInfo && !signed.includes(topKey)) {
                suffixes.forEach((s) => paths.push(`${topKey}.${s}`))
              }
            }
            return paths
          },
        }),
        buildHiddenInput({
          id: 'wrongHome.shouldRefetchNationalRegistry',
          condition: shouldShowRefetchNationalRegistrySection,
          defaultValue: 'true',
        }),
      ],
    }),
  ],
})
