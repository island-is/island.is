import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import {
  Services,
  Service,
  DistrictCommissionerAgencies,
  Passport,
  ChildsPersonalInfo,
} from '../../lib/constants'

export const childsOverview = buildMultiField({
  id: 'overviewChildsInfo',
  title: m.overview,
  description: m.overviewDescription,
  condition: (answers) => (answers.passport as Passport)?.childPassport !== '',
  children: [
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewChild.infoTitle',
      title: m.infoTitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.name,
      width: 'half',
      value: (application: Application) =>
        (application.answers.childsPersonalInfo as {
          name?: string
        })?.name,
    }),
    buildKeyValueField({
      label: m.nationalId,
      width: 'half',
      value: (application: Application) =>
        (application.answers.childsPersonalInfo as {
          nationalId?: string
        })?.nationalId,
    }),
    buildDescriptionField({
      id: 'overviewChild.space1',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewChild.infoTitle2',
      title: 'Forráðamaður 1',
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.name,
      width: 'half',
      value: (application: Application) =>
        ((application.answers.childsPersonalInfo as ChildsPersonalInfo)
          .guardian1 as {
          name?: string
        })?.name,
    }),
    buildKeyValueField({
      label: m.nationalId,
      width: 'half',
      value: (application: Application) =>
        ((application.answers.childsPersonalInfo as ChildsPersonalInfo)
          .guardian1 as {
          nationalId?: string
        })?.nationalId,
    }),
    buildDescriptionField({
      id: 'overviewChild.space2',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      value: (application: Application) =>
        ((application.answers.childsPersonalInfo as ChildsPersonalInfo)
          .guardian1 as {
          email?: string
        })?.email,
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      value: (application: Application) => {
        const phone = ((application.answers
          .childsPersonalInfo as ChildsPersonalInfo).guardian1 as {
          phoneNumber?: string
        })?.phoneNumber

        return formatPhoneNumber(phone as string)
      },
    }),
    buildDescriptionField({
      id: 'overviewChild.space3',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewChild.infoTitle3',
      title: 'Forráðamaður 2',
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.name,
      width: 'half',
      value: (application: Application) =>
        ((application.answers.childsPersonalInfo as ChildsPersonalInfo)
          .guardian2 as {
          name?: string
        })?.name,
    }),
    buildKeyValueField({
      label: m.nationalId,
      width: 'half',
      value: (application: Application) =>
        ((application.answers.childsPersonalInfo as ChildsPersonalInfo)
          .guardian2 as {
          nationalId?: string
        })?.nationalId,
    }),
    buildDescriptionField({
      id: 'overviewChild.space4',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      value: (application: Application) =>
        ((application.answers.childsPersonalInfo as ChildsPersonalInfo)
          .guardian2 as {
          email?: string
        })?.email,
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      value: (application: Application) => {
        const phone = ((application.answers
          .childsPersonalInfo as ChildsPersonalInfo).guardian2 as {
          phoneNumber?: string
        })?.phoneNumber

        return formatPhoneNumber(phone as string)
      },
    }),
    buildDescriptionField({
      id: 'overviewChild.space5',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildDividerField({}),
    buildDescriptionField({
      id: 'overview.dropLocationTitle',
      title: m.serviceTypeTitle,
      titleVariant: 'h3',
      description: '',
      space: 'gutter',
      marginBottom: 'gutter',
    }),
    buildKeyValueField({
      label: m.serviceTypeTitle,
      width: 'half',
      value: (application: Application) =>
        (application.answers.service as Service).type === Services.REGULAR
          ? m.serviceTypeRegular
          : m.serviceTypeExpress,
    }),
    buildKeyValueField({
      label: m.dropLocation,
      width: 'half',
      value: ({
        externalData: {
          districtCommissioners: { data },
        },
        answers,
      }) => {
        const district = (data as DistrictCommissionerAgencies[]).find(
          (d) => d.id === (answers.service as Service).dropLocation,
        )
        return `${district?.name}, ${district?.place}`
      },
    }),
  ],
})
