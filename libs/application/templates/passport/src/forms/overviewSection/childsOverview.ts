import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import { Passport, Service, Services } from '../../lib/constants'
import { m } from '../../lib/messages'
import { format as formatNationalId } from 'kennitala'
import { hasSecondGuardian } from '../../lib/utils'

export const childsOverview = buildMultiField({
  id: 'overviewChildsInfo',
  title: m.overview,
  description: m.overviewDescription,
  condition: (answers) => (answers.passport as Passport)?.childPassport !== '',
  children: [
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewChild.childTitle',
      title: m.child,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.name,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath(application.answers, 'childsPersonalInfo.name'),
    }),
    buildKeyValueField({
      label: m.nationalId,
      width: 'half',
      value: (application: Application) => {
        const nationalId = getValueViaPath(
          application.answers,
          'childsPersonalInfo.nationalId',
        )
        return formatNationalId(nationalId as string)
      },
    }),
    buildDescriptionField({
      id: 'overviewChild.space1',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewChild.infoTitle2',
      title: m.parent1,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.name,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian1.name',
        ),
    }),
    buildKeyValueField({
      label: m.nationalId,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian1.nationalId',
        ),
    }),
    buildDescriptionField({
      id: 'overviewChild.space2',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian1.email',
        ),
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      value: (application: Application) => {
        const phone = getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian1.phoneNumber',
        )
        return formatPhoneNumber(phone as string)
      },
    }),
    buildDescriptionField({
      id: 'overviewChild.space3',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewChild.infoTitle3',
      title: m.parent2,
      titleVariant: 'h3',
      space: 'gutter',
      marginBottom: 'gutter',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildKeyValueField({
      label: m.name,
      width: 'half',
      value: (application: Application) =>
        getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian2.name',
        ),
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildKeyValueField({
      label: m.nationalId,
      width: 'half',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
      value: (application: Application) => {
        const nationalId = getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian2.nationalId',
        )
        return formatNationalId(nationalId as string)
      },
    }),
    buildDescriptionField({
      id: 'overviewChild.space4',
      space: 'gutter',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
      value: (application: Application) =>
        getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian2.email',
        ),
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
      value: (application: Application) => {
        const phone = getValueViaPath(
          application.answers,
          'childsPersonalInfo.guardian2.phoneNumber',
        )
        return formatPhoneNumber(phone as string)
      },
    }),
    buildDescriptionField({
      id: 'overviewChild.space5',
      space: 'gutter',
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildDividerField({
      condition: (answers, externalData) =>
        hasSecondGuardian(answers, externalData),
    }),
    buildDescriptionField({
      id: 'overview.serviceTypeTitle',
      title: m.serviceTypeTitle,
      titleVariant: 'h3',
      description: (application: Application) =>
        (application.answers.service as Service).type === Services.REGULAR
          ? m.serviceTypeRegular
          : m.serviceTypeExpress,
      space: 'gutter',
      marginBottom: 'gutter',
    }),
  ],
})
