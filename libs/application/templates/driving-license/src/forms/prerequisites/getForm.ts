import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { LogreglanLogo } from '../../assets'
import { m } from '../../lib/messages'
import { sectionFakeData } from './sectionFakeData'
import { sectionExternalData } from './sectionExternalData'
import { sectionApplicationFor } from './sectionApplicationFor'
import { sectionRequirements } from './sectionRequirements'
import { sectionExistingApplication } from './sectionExistingApplication'

export const getForm = ({
  allowFakeData = false,
  allowPickLicense = false,
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
