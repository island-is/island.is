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
  buildTextField,
} from '@island.is/application/core'
import { format as formatNationalId } from 'kennitala'
import { m } from '../../lib/messages'
import { formatPhoneNumber } from '../../utils/index'
import format from 'date-fns/format'
import { Asset, Answers as AODAnswers, OtherPropertiesEnum } from '../../types'
import { FormatMessage } from '@island.is/localization'
import { getFileRecipientName } from '../../lib/utils'

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
    value: ({ answers }) => (answers.nameOfDeceased as string) || '',
  }),
  buildKeyValueField({
    label: m.deceasedNationalId,
    width: 'half',
    value: ({ answers }) =>
      formatNationalId(answers.nationalIdOfDeceased as string) || '',
  }),
  buildKeyValueField({
    label: m.deceasedDate,
    width: 'half',
    value: ({ answers }) =>
      format(new Date(answers.dateOfDeath as string), 'dd.MM.yy') || '',
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
    value: ({ answers }) => (answers.applicantName as string) || '',
  }),
  buildKeyValueField({
    label: m.applicantsPhoneNumber,
    width: 'half',
    value: ({ answers }) =>
      formatPhoneNumber(answers.applicantPhone as string) || '',
  }),
  buildKeyValueField({
    label: m.applicantsEmail,
    width: 'half',
    value: ({ answers }) => (answers.applicantEmail as string) || '',
  }),
  buildKeyValueField({
    label: m.applicantsRelation,
    width: 'half',
    value: ({ answers }) => (answers.applicantRelation as string) || '',
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
    value: ({ answers }) =>
      answers.districtCommissionerHasWill
        ? m.testamentKnowledgeOfOtherTestamentYes
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.testamentBuyration,
    width: 'half',
    value: ({ answers }) =>
      answers.marriageSettlement
        ? m.testamentKnowledgeOfOtherTestamentYes
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.testamentKnowledgeOfOtherTestament,
    width: 'half',
    value: ({ answers }) =>
      answers.knowledgeOfOtherWills === 'yes'
        ? m.testamentKnowledgeOfOtherTestamentYes
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
]

const extraInfo: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'otherProperties',
    title: m.otherPropertiesTitle,
    marginBottom: 2,
    titleVariant: 'h3',
  }),
  buildKeyValueField({
    label: m.otherPropertiesAccounts,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.ACCOUNTS,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.otherPropertiesOwnBusiness,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.OWN_BUSINESS,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.otherPropertiesResidence,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.RESIDENCE,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
  }),
  buildKeyValueField({
    label: m.otherPropertiesAssetsAbroad,
    width: 'half',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            OtherPropertiesEnum.ASSETS_ABROAD,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
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
          description: [formatNationalId(member.nationalId), member.relation],
        })),
    },
  ),
]
const properties: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'realEstatesAndLandsTitle',
    title: m.realEstatesTitle,
    titleVariant: 'h3',
    description: m.realEstatesDescription,
  }),
  buildCustomField(
    {
      title: '',
      id: 'assets',
      component: 'InfoCard',
      width: 'full',
      condition: (application) => (application?.assets as Asset[])?.length > 0,
    },
    {
      cards: ({ answers }: Application) =>
        (answers?.assets as Asset[]).map((property) => ({
          title: property.description,
          description: (formatMessage: FormatMessage) => [
            `${formatMessage(m.propertyNumber)}: ${property.assetNumber}`,
            property.share
              ? `${formatMessage(m.propertyShare)}: ${property.share * 100}%`
              : '',
          ],
        })),
    },
  ),
  buildDescriptionField({
    id: 'vehiclesTitle',
    title: m.vehiclesTitle,
    description: m.vehiclesDescription,
    space: 5,
    titleVariant: 'h3',
  }),
  buildCustomField(
    {
      title: '',
      id: 'vehicles',
      component: 'InfoCard',
      width: 'full',
      condition: (application) =>
        (application?.vehicles as Asset[])?.length > 0,
    },
    {
      cards: ({ answers }: Application) =>
        (answers?.vehicles as Asset[]).map((vehicle) => ({
          title: vehicle.assetNumber,
          description: [vehicle.description],
        })),
    },
  ),
]
const files: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'selectMainRecipient',
    title: m.filesSelectMainRecipient,
    titleVariant: 'h3',
  }),
  buildCustomField(
    {
      title: m.certificateOfDeathAnnouncementTitle,
      description: m.certificateOfDeathAnnouncementDescription,
      id: 'certificateOfDeathAnnouncement',
      component: 'FilesRecipientCard',
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers as AODAnswers,
          answers.certificateOfDeathAnnouncement as string,
        ),
    },
  ),
  buildCustomField(
    {
      title: m.financesDataCollectionPermissionTitle,
      description: m.financesDataCollectionPermissionDescription,
      id: 'financesDataCollectionPermission',
      component: 'FilesRecipientCard',
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers as AODAnswers,
          answers.financesDataCollectionPermission as string,
        ),
    },
  ),
  buildCustomField(
    {
      title: m.authorizationForFuneralExpensesTitle,
      description: m.authorizationForFuneralExpensesDescription,
      id: 'authorizationForFuneralExpenses',
      component: 'FilesRecipientCard',
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers as AODAnswers,
          answers.authorizationForFuneralExpenses as string,
        ),
    },
  ),
]

const additionalInfo: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'additionalInfoTitle',
    title: m.additionalInfoTitle,
    description: m.additionalInfoDescription,
    titleVariant: 'h3',
  }),
  buildTextField({
    id: 'additionalInfo',
    title: m.additionalInfoLabel,
    placeholder: m.additionalInfoPlaceholder,
    variant: 'textarea',
    rows: 4,
    defaultValue: '',
  }),
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
        ...properties,
        ...files,
        ...extraInfo,
        ...additionalInfo,
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
