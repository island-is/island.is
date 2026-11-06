import {
  buildAlertMessageField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { m } from '../../lib/messages'

// Informational screen in the prerequisites flow: the licence is now issued
// digitally first (available in the Ísland.is app once processing completes),
// with the plastic card produced and posted to the applicant's legal domicile
// afterwards. Purely informational — nothing is persisted.
//
// The notice applies to every driving-licence issuance flow, so by default it is
// shown unconditionally. Pass a list of `applicationFor` values to restrict it to
// specific flows instead (the sub-section and its stepper entry then render only
// for those types).
export const sectionDigitalLicense = (applicationTypes?: string[]) =>
  buildSubSection({
    id: 'digitalLicense',
    title: m.digitalLicenseSubSectionTitle,
    ...(applicationTypes && applicationTypes.length > 0
      ? {
          condition: (answers: FormValue) =>
            applicationTypes.includes(
              getValueViaPath<string>(answers, 'applicationFor') ?? '',
            ),
        }
      : {}),
    children: [
      buildMultiField({
        id: 'digitalLicenseInfo',
        title: m.digitalLicenseSubSectionTitle,
        children: [
          buildAlertMessageField({
            id: 'digitalLicenseAlert',
            title: m.digitalLicenseAlertTitle,
            message: m.digitalLicenseAlertMessage,
            alertType: 'info',
          }),
        ],
      }),
    ],
  })
