import {
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import { messages } from '../../lib/messages'

export const aboutTheCompanySection = buildSection({
  id: 'aboutTheCompany',
  title: messages.aboutTheCompany.section.sectionTitle,
  children: [
    buildSubSection({
      id: 'almennarUplysingar',
      title: messages.aboutTheCompany.almennarUpplysingar.sectionTitle,
      children: [
        buildMultiField({
          id: 'almennarUplysingarMultiField',
          title: messages.aboutTheCompany.almennarUpplysingar.title,
          description: messages.aboutTheCompany.almennarUpplysingar.intro,
          children: [
            buildDescriptionField({
              id: 'almennarUplysingar.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'aedstiStjornandi',
      title: messages.aboutTheCompany.aedstiStjornandi.sectionTitle,
      children: [
        buildMultiField({
          id: 'aedstiStjornandiMultiField',
          title: messages.aboutTheCompany.aedstiStjornandi.title,
          description: messages.aboutTheCompany.aedstiStjornandi.intro,
          children: [
            buildDescriptionField({
              id: 'aedstiStjornandi.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'tengiliður',
      title: messages.aboutTheCompany.tengiliður.sectionTitle,
      children: [
        buildMultiField({
          id: 'tengiliðurMultiField',
          title: messages.aboutTheCompany.tengiliður.title,
          description: messages.aboutTheCompany.tengiliður.intro,
          children: [
            buildDescriptionField({
              id: 'tengiliður.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'medalfjoldiStarfsmanna',
      title: messages.aboutTheCompany.medalfjoldiStarfsmanna.sectionTitle,
      children: [
        buildMultiField({
          id: 'medalfjoldiStarfsmannaMultiField',
          title: messages.aboutTheCompany.medalfjoldiStarfsmanna.title,
          description: messages.aboutTheCompany.medalfjoldiStarfsmanna.intro,
          children: [
            buildDescriptionField({
              id: 'medalfjoldiStarfsmanna.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'dotturfyrirtaeki',
      title: messages.aboutTheCompany.dotturfyrirtaeki.sectionTitle,
      children: [
        buildMultiField({
          id: 'dotturfyrirtaekiMultiField',
          title: messages.aboutTheCompany.dotturfyrirtaeki.title,
          description: messages.aboutTheCompany.dotturfyrirtaeki.intro,
          children: [
            buildDescriptionField({
              id: 'dotturfyrirtaeki.placeholder',
              title: '',
              description: '',
            }),
          ],
        }),
      ],
    }),
  ],
})
