import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { formatPhoneNumber } from '@island.is/application/ui-components'
import format from 'date-fns/format'
import {
  DistrictCommissionerAgencies,
  Service,
  Services,
  IdentityDocumentData,
} from '../../lib/constants'
import { m } from '../../lib/messages'

export const overview = buildMultiField({
  id: 'overviewPersonalInfo',
  title: m.overview,
  description: m.overviewDescription,
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
        (application.answers.info as {
          name?: string
        })?.name,
    }),
    buildKeyValueField({
      label: m.passportNumber,
      width: 'half',
      value: (application: Application) =>
        (application.answers.info as {
          passportNumber?: string
        })?.passportNumber,
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
        console.log(application.answers)
        const date = (application.externalData.identityDocument
          .data as IdentityDocumentData).userPassport?.expirationDate
        return date
          ? m.currentPassportExpiration.defaultMessage +
              ' ' +
              format(new Date(date), 'dd/MM/yy')
          : m.noPassport.defaultMessage
      },
    }),
    buildDescriptionField({
      id: 'overview.space3',
      title: '',
      description: '',
      space: 'gutter',
    }),
    buildDividerField({}),
  ],
})
