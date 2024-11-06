import { buildPhoneField, buildSubSection } from '@island.is/application/core'

export const phoneSubsection = buildSubSection({
  id: 'phone',
  title: 'Phone',
  children: [
    buildPhoneField({
      id: 'phone',
      title: 'Phone',
    }),
  ],
})
