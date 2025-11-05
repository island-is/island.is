import { buildSection } from '@island.is/application/core'
import { accidentType } from '../../../lib/messages'
import { accidentTypeSubSection } from './accidentTypeSubSection'
import { workAccidentSubSection } from './workAccidentSubSection'
import { studiesAccidentSubSection } from './studiesAccidentSubSection'
import { locationSubSection } from './locationSubSection'
import { workMachineSubSection } from './workMachineSubSection'
import { accidentDetailsSubSection } from './accidentDetailSubSection'
import { attachmentsSubSection } from './attachmentsSubSection'
import { schoolInfoSubSection } from './schoolInfoSubSection'
import { fishingCompanyInfoSubSection } from './fishingCompanyInfoSubSection'
import { sportsClubInfoSubSection } from './sportsClubInfoSubSection'
import { rescueSquadInfoSubSection } from './rescueSquadInfoSubSection'
import { companyInfoSubSection } from './companyInfoSubSection'

export const aboutTheAccidentSection = buildSection({
  id: 'accidentType.section',
  title: accidentType.general.sectionTitle,
  children: [
    accidentTypeSubSection,
    workAccidentSubSection,
    studiesAccidentSubSection,
    locationSubSection,
    workMachineSubSection,
    accidentDetailsSubSection,
    attachmentsSubSection,
    companyInfoSubSection,
    schoolInfoSubSection,
    fishingCompanyInfoSubSection,
    sportsClubInfoSubSection,
    rescueSquadInfoSubSection,
  ],
})
