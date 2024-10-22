import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildCustomField,
  buildTextField,
  YES,
} from '@island.is/application/core'
import { Answer, Application, Field } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../lib/messages'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import format from 'date-fns/format'
import { Answers as AODAnswers, PropertiesEnum } from '../types'
import { getFileRecipientName } from '../lib/utils'
import { EstateRegistrant } from '@island.is/clients/syslumenn'

const showInDone = (showInDone: Answer) => {
  return showInDone === true || (showInDone === undefined ?? true)
}

export const theDeceased: Field[] = [
  buildDividerField({
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'theDeceased',
    title: m.overviewTheDeceased,
    titleVariant: 'h3',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.deceasedName,
    width: 'half',
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      ((data as { estate: EstateRegistrant }).estate
        .nameOfDeceased as string) || '',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.deceasedNationalId,
    width: 'half',
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      formatNationalId(
        (data as { estate: EstateRegistrant }).estate
          .nationalIdOfDeceased as string,
      ) || '',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.deceasedDate,
    width: 'half',
    value: ({
      externalData: {
        syslumennOnEntry: { data },
      },
    }) =>
      format(
        new Date(
          (data as { estate: EstateRegistrant }).estate
            .dateOfDeath as unknown as string,
        ),
        'dd.MM.yy',
      ) || '',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
]

export const theAnnouncer: Field[] = [
  buildDividerField({
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'theAnnouncer',
    title: m.announcementTitle,
    titleVariant: 'h3',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.applicantsName,
    width: 'half',
    value: ({ answers }) => (answers.applicantName as string) || '',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.applicantsPhoneNumber,
    width: 'half',
    value: ({ answers }) =>
      formatPhoneNumber(answers.applicantPhone as string) || '',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.applicantsEmail,
    width: 'half',
    value: ({ answers }) => (answers.applicantEmail as string) || '',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.applicantsRelation,
    width: 'half',
    value: ({ answers }) => (answers.applicantRelation as string) || '',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
]

export const testament: Field[] = [
  buildDividerField({
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'testament',
    title: m.testamentTitle,
    titleVariant: 'h3',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.testamentKnowledgeOfOtherTestament,
    width: 'full',
    value: ({ answers }) =>
      answers.knowledgeOfOtherWills === 'yes'
        ? m.testamentKnowledgeOfOtherTestamentYes
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
]

export const inheritance: Field[] = [
  buildDividerField({
    condition: (answers) =>
      (answers?.estateMembers as any)?.members?.length > 0 &&
      showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'inheritance',
    title: m.inheritanceTitle,
    titleVariant: 'h3',
    condition: (answers) =>
      (answers?.estateMembers as any)?.members?.length > 0 &&
      showInDone(answers.viewOverview),
  }),
  buildCustomField(
    {
      title: '',
      id: 'electPerson',
      component: 'InfoCard',
      width: 'full',
      condition: (answers) =>
        (answers?.estateMembers as any)?.members?.length > 0 &&
        showInDone(answers.viewOverview),
    },
    {
      cards: (application: Application) =>
        (
          (application?.answers?.estateMembers as any).members as {
            name: string
            nationalId: string
            relation: string
            dummy?: boolean
          }[]
        )
          .filter((member) => !member?.dummy)
          .map((member) => ({
            title: member.name,
            description: [formatNationalId(member.nationalId), member.relation],
          })),
    },
  ),
]

export const properties: Field[] = [
  buildDividerField({
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'propertiesTitle',
    title: m.propertiesTitle,
    titleVariant: 'h3',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.propertiesRealEstate,
    width: 'full',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            PropertiesEnum.REAL_ESTATE,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.propertiesVehicles,
    width: 'full',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            PropertiesEnum.VEHICLES,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.otherPropertiesAccounts,
    width: 'full',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            PropertiesEnum.ACCOUNTS,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.otherPropertiesOwnBusiness,
    width: 'full',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            PropertiesEnum.OWN_BUSINESS,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.otherPropertiesResidence,
    width: 'full',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            PropertiesEnum.RESIDENCE,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.otherPropertiesAssetsAbroad,
    width: 'full',
    value: ({ answers }) =>
      answers?.otherProperties
        ? (answers.otherProperties as string[]).includes(
            PropertiesEnum.ASSETS_ABROAD,
          )
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
]

export const files: Field[] = [
  buildDividerField({
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'selectMainRecipient',
    title: m.filesSelectMainRecipient,
    titleVariant: 'h3',
    marginBottom: 2,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildCustomField(
    {
      title: m.certificateOfDeathAnnouncementTitle,
      id: 'certificateOfDeathAnnouncement',
      component: 'FilesRecipientCard',
      condition: (answers) => showInDone(answers.viewOverview),
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
      id: 'financesDataCollectionPermission',
      component: 'FilesRecipientCard',
      condition: (answers) => showInDone(answers.viewOverview),
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
      id: 'authorizationForFuneralExpenses',
      component: 'FilesRecipientCard',
      condition: (answers) => showInDone(answers.viewOverview),
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

export const firearmApplicant: Field[] = [
  buildDividerField({
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'firearmApplicant',
    title: m.firearmsApplicantOverviewHeader,
    titleVariant: 'h3',
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildKeyValueField({
    label: m.firearmsHadFirearms,
    width: 'full',
    value: ({ answers }) =>
      answers.hadFirearms === YES ? m.firearmsYes : m.firearmsNo,
    condition: (answers) => showInDone(answers.viewOverview),
  }),
  buildDescriptionField({
    id: 'firearmApplicantInfo',
    title: m.firearmsApplicant,
    titleVariant: 'h3',
    space: 2,
    condition: (answers) =>
      showInDone(answers.viewOverview) && answers.hadFirearms === YES,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantName,
    width: 'half',
    value: ({ answers }) => (answers.firearmApplicant as any)?.name || '',
    condition: (answers) =>
      showInDone(answers.viewOverview) && answers.hadFirearms === YES,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantNationalId,
    width: 'half',
    value: ({ answers }) =>
      formatNationalId((answers.firearmApplicant as any)?.nationalId || ''),
    condition: (answers) =>
      showInDone(answers.viewOverview) && answers.hadFirearms === YES,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantPhone,
    width: 'half',
    value: ({ answers }) =>
      formatPhoneNumber((answers.firearmApplicant as any)?.phone || ''),
    condition: (answers) =>
      showInDone(answers.viewOverview) && answers.hadFirearms === YES,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantEmail,
    width: 'half',
    value: ({ answers }) => (answers.firearmApplicant as any)?.email || '',
    condition: (answers) =>
      showInDone(answers.viewOverview) && answers.hadFirearms === YES,
  }),
]

export const additionalInfo: Field[] = [
  buildDividerField({}),
  buildDescriptionField({
    id: 'additionalInfoTitle',
    title: m.additionalInfoTitle,
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
