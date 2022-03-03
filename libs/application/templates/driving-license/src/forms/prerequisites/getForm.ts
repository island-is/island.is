import {
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'

import { LogreglanLogo } from '../../assets'
import { m } from '../../lib/messages'

import { sectionApplicationFor } from './sectionApplicationFor'
import { sectionExistingApplication } from './sectionExistingApplication'
import { sectionExternalData } from './sectionExternalData'
import { sectionFakeData } from './sectionFakeData'
import { sectionRequirements } from './sectionRequirements'

export const getForm = ({
  allowFakeData = false,
  allowPickLicense = false,
}): Form =>
  buildForm({
    id: 'DrivingLicenseApplicationPrerequisitesForm',
    title: m.applicationName,
    logo: LogreglanLogo,
    mode: FormModes.APPLYING,
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
          ...(allowPickLicense ? [sectionApplicationFor] : []),
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
        id: 'confim',
        title: m.overviewDone,
        children: [],
      }),
    ],
  })
