import {
  buildForm,
  buildSection,
  Form,
  FormModes,
  FormValue,
  getValueViaPath,
} from '@island.is/application/core'
import { subSectionInfo } from './subSectionInfo'
import { subSectionInheritance } from './subSectionInheritance'
import { subSectionWillAndTrade } from './subSectionWillAndTrade'
import { subSectionProperties } from './subSectionProperties'
import { m } from '../../lib/messages'
import { RoleConfirmationEnum } from '../../types'
import CoatOfArms from '../../assets/CoatOfArms'
import { subSectionFiles } from './subSectionFiles'
import { sectionOverview } from './sectionOverview'

export const draft = (): Form => {
  return buildForm({
    id: 'AnnouncementOfDeathApplicationDraftForm',
    title: '', // m.applicationTitle,
    logo: CoatOfArms,
    mode: FormModes.APPLYING,
    renderLastScreenButton: true,
    renderLastScreenBackButton: true,
    children: [
      buildSection({
        id: 'roleConfirmation',
        title: m.roleConfirmationSectionTitle,
        children: [],
      }),
      buildSection({
        id: 'externalData',
        title: m.dataCollectionTitle,
        children: [],
      }),
      buildSection({
        id: 'info',
        title: m.infoSectionTitle,
        children: [
          subSectionInfo,
          subSectionWillAndTrade,
          subSectionInheritance,
          subSectionProperties,
          subSectionFiles,
        ],
      }),
      sectionOverview,
    ],
  })
}
