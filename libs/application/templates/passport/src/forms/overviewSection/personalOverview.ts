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
} from '../../lib/constants'
import format from 'date-fns/format'

export const personalOverview = buildMultiField({
  id: 'overviewPersonalInfo',
  title: m.overview,
  description: m.overviewDescription,
  condition: (answers) => (answers.passport as Passport)?.userPassport !== '',
  children: [
    buildDividerField({}),
    buildDescriptionField({
      id: 'overviewPI.infoTitle',
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
        (application.answers.personalInfo as {
          name?: string
        })?.name,
    }),
    buildKeyValueField({
      label: m.nationalId,
      width: 'half',
      value: (application: Application) =>
        (application.answers.personalInfo as {
          nationalId?: string
        })?.nationalId,
    }),
    buildDescriptionField({
      id: 'overview.space1',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.email,
      width: 'half',
      value: (application: Application) =>
        (application.answers.personalInfo as {
          email?: string
        })?.email,
    }),
    buildKeyValueField({
      label: m.phoneNumber,
      width: 'half',
      value: (application: Application) => {
        const phone = (application.answers.personalInfo as {
          phoneNumber?: string
        })?.phoneNumber

        return formatPhoneNumber(phone as string)
      },
    }),
    buildDescriptionField({
      id: 'overview.space2',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildKeyValueField({
      label: m.currentPassportStatus,
      width: 'half',
      value: (application: Application) => {
        const date = (application.externalData.identityDocument?.data as {
          expirationDate?: string
        })?.expirationDate

        return (
          m.currentPassportExpiration.defaultMessage +
          ' ' +
          format(new Date(date as string), 'dd.MM.yy')
        )
      },
    }),
    buildDescriptionField({
      id: 'overview.space3',
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
