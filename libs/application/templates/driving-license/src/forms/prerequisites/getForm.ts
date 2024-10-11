import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { LogreglanLogo } from '../../assets'
import { m } from '../../lib/messages'
import { sectionFakeData } from './sectionFakeData'
import { sectionExternalData } from './sectionExternalData'
import { sectionApplicationFor } from './sectionApplicationFor'
import { sectionRequirements } from './sectionRequirements'
import { sectionExistingApplication } from './sectionExistingApplication'
import { sectionDigitalLicenseInfo } from './sectionDigitalLicenseInfo'

export const getForm = ({
  allowFakeData = false,
  allowPickLicense = false,
  allowBELicense = false,
  allow65Renewal = false,
}): Form =>
  buildForm({
    id: 'DrivingLicenseApplicationPrerequisitesForm',
    title: '',
    logo: LogreglanLogo,
    mode: FormModes.DRAFT,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'externalData',
        title: m.externalDataSection,
        children: [
          ...(allowFakeData ? [sectionFakeData] : []),
          sectionExternalData,
          sectionExistingApplication,
          ...(allowPickLicense
            ? [sectionApplicationFor(allowBELicense, allow65Renewal)]
            : []),
          sectionDigitalLicenseInfo,
          sectionRequirements,
        ],
      }),
      buildSection({
        id: 'info',
        title: m.informationTitle,
        children: [],
      }),
      buildSection({
        id: 'payment',
        title: m.overviewPaymentCharge,
        children: [],
      }),
      buildSection({
        id: 'confirm',
        title: m.applicationDone,
        children: [],
      }),
    ],
  })
