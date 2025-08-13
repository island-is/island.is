import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildCustomField,
  buildTextField,
  YES,
  getValueViaPath,
} from '@island.is/application/core'
import { Application, Field } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { m } from '../lib/messages'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import format from 'date-fns/format'
import { EstateMember, PropertiesEnum } from '../types'
import {
  estateMemberAndShowInDone,
  getFileRecipientName,
  showInDone,
  showInDoneAndHadFirearms,
} from '../lib/utils'

export const theDeceased: Field[] = [
  buildDividerField({
    condition: showInDone,
  }),
  buildDescriptionField({
    id: 'theDeceased',
    title: m.overviewTheDeceased,
    titleVariant: 'h3',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.deceasedName,
    width: 'half',
    value: ({ externalData }) =>
      getValueViaPath<string>(
        externalData,
        'syslumennOnEntry.data.estate.nameOfDeceased',
      ) || '',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.deceasedNationalId,
    width: 'half',
    value: ({ externalData }) =>
      formatNationalId(
        getValueViaPath<string>(
          externalData,
          'syslumennOnEntry.data.estate.nationalIdOfDeceased',
        ) || '',
      ),
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.deceasedDate,
    width: 'half',
    value: ({ externalData }) =>
      format(
        new Date(
          getValueViaPath<string>(
            externalData,
            'syslumennOnEntry.data.estate.dateOfDeath',
          ) || '',
        ),
        'dd.MM.yy',
      ) || '',
    condition: showInDone,
  }),
]

export const theAnnouncer: Field[] = [
  buildDividerField({
    condition: showInDone,
  }),
  buildDescriptionField({
    id: 'theAnnouncer',
    title: m.announcementTitle,
    titleVariant: 'h3',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.applicantsName,
    width: 'half',
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'applicantName') || '',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.applicantsPhoneNumber,
    width: 'half',
    value: ({ answers }) =>
      formatPhoneNumber(
        getValueViaPath<string>(answers, 'applicantPhone') || '',
      ),
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.applicantsEmail,
    width: 'half',
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'applicantEmail') || '',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.applicantsRelation,
    width: 'half',
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'applicantRelation') || '',
    condition: showInDone,
  }),
]

export const testament: Field[] = [
  buildDividerField({
    condition: showInDone,
  }),
  buildDescriptionField({
    id: 'testament',
    title: m.testamentTitle,
    titleVariant: 'h3',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.testamentKnowledgeOfOtherTestament,
    width: 'full',
    value: ({ answers }) =>
      answers.knowledgeOfOtherWills === 'yes'
        ? m.testamentKnowledgeOfOtherTestamentYes
        : m.testamentKnowledgeOfOtherTestamentNo,
    condition: showInDone,
  }),
]

export const inheritance: Field[] = [
  buildDividerField({
    condition: estateMemberAndShowInDone,
  }),
  buildDescriptionField({
    id: 'inheritance',
    title: m.inheritanceTitle,
    titleVariant: 'h3',
    condition: estateMemberAndShowInDone,
  }),
  buildCustomField(
    {
      title: '',
      id: 'electPerson',
      component: 'InfoCard',
      width: 'full',
      condition: estateMemberAndShowInDone,
    },
    {
      cards: (application: Application) => {
        const members =
          getValueViaPath<Array<EstateMember>>(
            application.answers,
            'estateMembers.members',
          ) ?? []

        return members
          .filter((member) => !member?.dummy)
          .map((member) => ({
            title: member.name,
            description: [formatNationalId(member.nationalId), member.relation],
          }))
      },
    },
  ),
]

export const properties: Field[] = [
  buildDividerField({
    condition: showInDone,
  }),
  buildDescriptionField({
    id: 'propertiesTitle',
    title: m.propertiesTitle,
    titleVariant: 'h3',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.propertiesRealEstate,
    width: 'full',
    value: ({ answers }) => {
      const otherProperties = getValueViaPath<Array<string>>(
        answers,
        'otherProperties',
      )
      return otherProperties
        ? otherProperties.includes(PropertiesEnum.REAL_ESTATE)
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo
    },
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.propertiesVehicles,
    width: 'full',
    value: ({ answers }) => {
      const otherProperties = getValueViaPath<Array<string>>(
        answers,
        'otherProperties',
      )
      return otherProperties
        ? otherProperties.includes(PropertiesEnum.VEHICLES)
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo
    },
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.otherPropertiesAccounts,
    width: 'full',
    value: ({ answers }) => {
      const otherProperties = getValueViaPath<Array<string>>(
        answers,
        'otherProperties',
      )

      return otherProperties
        ? otherProperties.includes(PropertiesEnum.ACCOUNTS)
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo
    },
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.otherPropertiesOwnBusiness,
    width: 'full',
    value: ({ answers }) => {
      const otherProperties = getValueViaPath<Array<string>>(
        answers,
        'otherProperties',
      )
      return otherProperties
        ? otherProperties.includes(PropertiesEnum.OWN_BUSINESS)
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo
    },
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.otherPropertiesResidence,
    width: 'full',
    value: ({ answers }) => {
      const otherProperties = getValueViaPath<Array<string>>(
        answers,
        'otherProperties',
      )
      return otherProperties
        ? otherProperties.includes(PropertiesEnum.RESIDENCE)
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo
    },
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.otherPropertiesAssetsAbroad,
    width: 'full',
    value: ({ answers }) => {
      const otherProperties = getValueViaPath<Array<string>>(
        answers,
        'otherProperties',
      )
      return otherProperties
        ? otherProperties.includes(PropertiesEnum.ASSETS_ABROAD)
          ? m.testamentKnowledgeOfOtherTestamentYes
          : m.testamentKnowledgeOfOtherTestamentNo
        : m.testamentKnowledgeOfOtherTestamentNo
    },
    condition: showInDone,
  }),
]

export const files: Field[] = [
  buildDividerField({
    condition: showInDone,
  }),
  buildDescriptionField({
    id: 'selectMainRecipient',
    title: m.filesSelectMainRecipient,
    titleVariant: 'h3',
    marginBottom: 2,
    condition: showInDone,
  }),
  buildCustomField(
    {
      title: m.certificateOfDeathAnnouncementTitle,
      id: 'certificateOfDeathAnnouncement',
      component: 'FilesRecipientCard',
      condition: showInDone,
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers,
          getValueViaPath<string>(answers, 'certificateOfDeathAnnouncement'),
        ),
    },
  ),
  buildCustomField(
    {
      title: m.financesDataCollectionPermissionTitle,
      id: 'financesDataCollectionPermission',
      component: 'FilesRecipientCard',
      condition: showInDone,
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers,
          getValueViaPath<string>(answers, 'financesDataCollectionPermission'),
        ),
    },
  ),
  buildCustomField(
    {
      title: m.authorizationForFuneralExpensesTitle,
      id: 'authorizationForFuneralExpenses',
      component: 'FilesRecipientCard',
      condition: showInDone,
    },
    {
      noOptions: true,
      tag: ({ answers }: Application) =>
        getFileRecipientName(
          answers,
          getValueViaPath<string>(answers, 'authorizationForFuneralExpenses'),
        ),
    },
  ),
]

export const firearmApplicant: Field[] = [
  buildDividerField({
    condition: showInDone,
  }),
  buildDescriptionField({
    id: 'firearmApplicant',
    title: m.firearmsApplicantOverviewHeader,
    titleVariant: 'h3',
    condition: showInDone,
  }),
  buildKeyValueField({
    label: m.firearmsHadFirearms,
    width: 'full',
    value: ({ answers }) =>
      answers.hadFirearms === YES ? m.firearmsYes : m.firearmsNo,
    condition: showInDone,
  }),
  buildDescriptionField({
    id: 'firearmApplicantInfo',
    title: m.firearmsApplicant,
    titleVariant: 'h3',
    space: 2,
    condition: showInDoneAndHadFirearms,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantName,
    width: 'half',
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'firearmApplicant.name') || '',
    condition: showInDoneAndHadFirearms,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantNationalId,
    width: 'half',
    value: ({ answers }) =>
      formatNationalId(
        getValueViaPath<string>(answers, 'firearmApplicant.nationalId') || '',
      ),
    condition: showInDoneAndHadFirearms,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantPhone,
    width: 'half',
    value: ({ answers }) =>
      formatPhoneNumber(
        getValueViaPath<string>(answers, 'firearmApplicant.phone') || '',
      ),
    condition: showInDoneAndHadFirearms,
  }),
  buildKeyValueField({
    label: m.firearmsApplicantEmail,
    width: 'half',
    value: ({ answers }) =>
      getValueViaPath<string>(answers, 'firearmApplicant.email') || '',
    condition: showInDoneAndHadFirearms,
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
