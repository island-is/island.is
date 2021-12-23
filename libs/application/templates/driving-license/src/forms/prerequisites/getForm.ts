import {
  buildForm,
  buildSection,
  Form,
  FormModes,
} from '@island.is/application/core'
import { LogreglanLogo } from '../../assets'
import { m } from '../../lib/messages'
import { sectionFakeData } from './sectionFakeData'
import { sectionExternalData } from './sectionExternalData'
import { sectionApplicationFor } from './sectionApplicationFor'
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
        id: 'foreignlic',
        title: m.foreignDrivingLicense,
        children: [],
      }),
      buildSection({
        id: 'photo',
        title: m.qualityPhotoTitle,
        children: [],
      }),
      buildSection({
        id: 'confim',
        title: m.overviewSectionTitle,
        children: [],
      }),
    ],
  })
