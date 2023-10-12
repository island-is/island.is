import {
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { Application } from '@island.is/application/types'
import { removeCountryCode } from '@island.is/application/ui-components'

export const subSectionOperationInfo = buildSubSection({
  id: 'info',
  title: m.operationInfoTitle,
  children: [
    buildMultiField({
      id: 'info',
      title: m.operationInfoTitle,
      description: m.infoSubtitle,
      children: [
        buildTextField({
          id: 'info.operationName',
          title: m.operationName,
          width: 'half',
        }),
        buildTextField({
          id: 'info.vskNr',
          title: m.vskNr,
          width: 'half',
          format: '######',
        }),
        buildTextField({
          id: 'info.email',
          title: m.email,
          width: 'half',
          defaultValue: (application: Application) =>
            (
              application.externalData.userProfile?.data as {
                email?: string
              }
            )?.email,
        }),
        buildTextField({
          id: 'info.phoneNumber',
          title: m.phoneNumber,
          width: 'half',
          variant: 'tel',
          format: '###-####',
          defaultValue: (application: Application) => {
            const phone =
              (
                application.externalData.userProfile?.data as {
                  mobilePhoneNumber?: string
                }
              )?.mobilePhoneNumber ?? ''

            return removeCountryCode(phone)
          },
          placeholder: '000-0000',
        }),
      ],
    }),
  ],
})
