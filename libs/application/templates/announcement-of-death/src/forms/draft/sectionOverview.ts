import {
  buildMultiField,
  Application,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildSubmitField,
  DefaultEvents,
  buildSection,
  Field,
  buildCustomField,
  Answer,
} from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import { NationalRegistryUser, UserProfile } from '../../types/schema'
import { m } from '../../lib/messages'

const theDeceased: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'theDeceased',
    title: m.overviewTheDeceased,
    marginBottom: 2,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.deceasedName,
    width: 'half',
    value: (data) => (console.log(data), 'test'),
  }),
  buildKeyValueField({
    label: m.deceasedNationalId,
    width: 'half',
    value: (application: Application) =>
      formatNationalId(application.applicant),
  }),
  buildKeyValueField({
    label: m.deceasedDate,
    width: 'half',
    value: () => 'test',
  }),
]

const theAnnouncer: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'theAnnouncer',
    title: m.announcementTitle,
    marginBottom: 2,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.applicantsName,
    width: 'half',
    value: () => 'test',
  }),
  buildKeyValueField({
    label: m.applicantsPhoneNumber,
    width: 'half',
    value: ({ externalData: { userProfile } }) =>
      (userProfile.data as UserProfile).mobilePhoneNumber as string,
  }),
  buildKeyValueField({
    label: m.applicantsEmail,
    width: 'half',
    value: ({ externalData: { userProfile } }) =>
      (userProfile.data as UserProfile).email as string,
  }),
  buildKeyValueField({
    label: m.applicantsRelation,
    width: 'half',
    value: ({ externalData: { userProfile } }) =>
      (userProfile.data as UserProfile).mobilePhoneNumber as string,
  }),
]

const testament: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'testament',
    title: m.testamentTitle,
    marginBottom: 2,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.testamentTestamentAvailable,
    width: 'half',
    value: ({ externalData: { userProfile } }) =>
      (userProfile.data as UserProfile).mobilePhoneNumber as string,
  }),
  buildKeyValueField({
    label: m.testamentBuyration,
    width: 'half',
    value: ({ externalData: { userProfile } }) =>
      (userProfile.data as UserProfile).mobilePhoneNumber as string,
  }),
  buildKeyValueField({
    label: m.testamentKnowledgeOfOtherTestament,
    width: 'half',
    value: ({ externalData: { userProfile } }) =>
      (userProfile.data as UserProfile).mobilePhoneNumber as string,
  }),
]
const inheritance: Field[] = [
  buildDividerField({
    condition: (application) =>
      (application?.estateMembers as Answer[])?.length > 0,
  }),
  buildDescriptionField({
    id: 'inheritance',
    title: m.inheritanceTitle,
    titleVariant: 'h3',
    condition: (application) =>
      (application?.estateMembers as Answer[])?.length > 0,
  }),
  buildCustomField(
    {
      title: '',
      id: 'electPerson',
      component: 'InfoCard',
      width: 'full',
      condition: (application) =>
        (application?.estateMembers as Answer[])?.length > 0,
    },
    {
      cards: (application: Application) =>
        (application?.answers?.estateMembers as {
          name: string
          nationalId: string
          relation: string
        }[]).map((member) => ({
          title: member.name,
          description: [member.nationalId, member.relation],
        })),
    },
  ),
]

export const sectionOverview = buildSection({
  id: 'overview',
  title: m.overviewSectionTitle,
  children: [
    buildMultiField({
      id: 'overview',
      title: m.overviewSectionTitle,
      space: 1,
      description: m.overviewSectionDescription,
      children: [
        ...theDeceased,
        ...theAnnouncer,
        ...testament,
        ...inheritance,
        buildSubmitField({
          id: 'submit',
          title: '',
          placement: 'footer',
          refetchApplicationAfterSubmit: true,
          actions: [
            {
              event: DefaultEvents.SUBMIT,
              name: m.submitApplication,
              type: 'primary',
            },
          ],
        }),
      ],
    }),
  ],
})
