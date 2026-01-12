import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { TheIcelandicPoliceLogo } from '@island.is/application/assets/institution-logos'
import { m } from '../../lib/messages'
import { sectionFakeData } from './sectionFakeData'
import { sectionExternalData } from './sectionExternalData'
import { sectionApplicationFor } from './sectionApplicationFor'
import { sectionRequirements } from './sectionRequirements'
import { sectionExistingApplication } from './sectionExistingApplication'
import { sectionAdvancedLicenseSelection } from './sectionAdvancedLicenseSelection'

interface DrivingLicenseFormConfig {
  allowFakeData?: boolean
  allowPickLicense?: boolean
  allowBELicense?: boolean
  allow65Renewal?: boolean
  allowAdvanced?: boolean
}

export const getForm = ({
  allowFakeData = false,
  allowPickLicense = false,
  allowBELicense = false,
  allow65Renewal = false,
  allowAdvanced = false,
}: DrivingLicenseFormConfig): Form =>
  buildForm({
    id: 'DrivingLicenseApplicationPrerequisitesForm',
    logo: TheIcelandicPoliceLogo,
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
            ? [
                sectionApplicationFor(
                  allowBELicense,
                  allow65Renewal,
                  allowAdvanced,
                ),
              ]
            : []),
          ...(allowAdvanced ? [sectionAdvancedLicenseSelection] : []),
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
