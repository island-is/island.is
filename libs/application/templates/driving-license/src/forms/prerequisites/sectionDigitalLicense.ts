import {
  buildAlertMessageField,
  buildMultiField,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { m } from '../../lib/messages'
import { B_FULL } from '../../lib/constants'

// Informational screen in the prerequisites flow: the licence is now issued
// digitally first and made available as soon as the application is completed,
// with the plastic card produced and posted to the applicant's legal domicile
// afterwards. Purely informational — nothing is persisted.
//
// Reusable across application types: pass the `applicationFor` values it should
// appear for and the sub-section (and its stepper entry) only renders for those.
// Wired to B-full for now; extend the list once product confirms which other
// types it applies to.
export const sectionDigitalLicense = (applicationTypes: string[] = [B_FULL]) =>
  buildSubSection({
    id: 'digitalLicense',
    title: m.digitalLicenseSubSectionTitle,
    condition: (answers: FormValue) =>
      applicationTypes.includes(
        getValueViaPath<string>(answers, 'applicationFor') ?? '',
      ),
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
