import { buildMultiField, buildSubSection } from '@island.is/application/core'

import { personal as personalMessages } from '../../../lib/messages'

export const personalSubSection = buildSubSection({
  id: 'firstSection',
  title: 'First section',
  children: [
    buildMultiField({
      id: 'firstSection',
      title: personalMessages.general.pageTitle,
      description: personalMessages.general.pageDescription,
      children: [],
    }),
  ],
})
