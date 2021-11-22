import { buildCustomField, buildSection } from '@island.is/application/core'
import { betaTest } from '../../lib/messages'

// Should only be here with the soft release, remove on official release.
export const betaTestSection = buildSection({
  id: 'betaTest.section',
  title: betaTest.title,
  children: [
    buildCustomField(
      {
        id: 'betaTest.section.textField',
        title: betaTest.title,
        component: 'DescriptionWithLink',
      },
      {
        descriptionFirstPart: betaTest.descriptionFirstPart,
        descriptionSecondPart: betaTest.descriptionSecondPart,
        linkName: betaTest.emailText,
        url: betaTest.email,
      },
    ),
  ],
})
