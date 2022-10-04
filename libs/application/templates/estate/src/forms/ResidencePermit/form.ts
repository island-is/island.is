import {
  buildCustomField,
  buildDescriptionField,
  buildForm,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { announcerInfo } from '../sharedSections/announcerInfo'
import { dataCollection } from '../sharedSections/dataCollection'
import { willsAndAgreements } from '../sharedSections/willsAndAgreements'

export const form: Form = buildForm({
  id: 'residencePermitForm',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    dataCollection,
    announcerInfo,
    buildSection({
      id: 'estateMembersInfo',
      title: m.estateMembersTitle,
      children: [
        buildMultiField({
          id: 'estateMembersInfo',
          title: m.estateMembersTitle,
          description: m.estateMembersSubtitle,
          children: [
            buildDescriptionField({
              id: 'membersOfEstateTitle',
              title: m.estateMembers,
              description: m.estateMembersHeaderDescription,
              titleVariant: 'h3',
            }),
            buildCustomField({
              title: '',
              id: 'estateMembers',
              component: 'EstateMemberRepeater',
              childInputIds: [
                'estateMembers.encountered',
                'estateMembers.members',
              ],
            }),
            ...willsAndAgreements,
          ],
        }),
      ],
    }),
  ],
})
