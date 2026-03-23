import { buildForm, buildSection } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { subSectionInfo } from './subSectionInfo'
import { subSectionInheritance } from './subSectionInheritance'
import { subSectionWillAndTrade } from './subSectionWillAndTrade'
import { subSectionProperties } from './subSectionProperties'
import { m } from '../../lib/messages'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'
import { subSectionFiles } from './subSectionFiles'
import { sectionOverview } from './sectionOverview'
import { subSectionFirearms } from './subSectionFirearms'

export const draft: Form = buildForm({
  id: 'AnnouncementOfDeathApplicationDraftForm',
  title: m.applicationTitle,
  logo: CoatOfArms,
  mode: FormModes.DRAFT,
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
        subSectionFirearms,
        subSectionFiles,
      ],
    }),
    sectionOverview,
  ],
})
