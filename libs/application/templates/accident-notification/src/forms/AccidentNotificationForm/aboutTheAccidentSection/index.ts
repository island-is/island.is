import { buildSection } from '@island.is/application/core'
import { accidentType } from '../../../lib/messages'
import { accidentTypeScreen } from './accidentTypeScreen'
import { workAccidentScreen } from './workAccidentScreen'
import { studiesAccidentScreen } from './studiesAccidentScreen'
import { locationScreen } from './locationScreen'
import { workMachineScreen } from './workMachineScreen'
import { accidentDetailsScreen } from './accidentDetailScreen'
import { attachmentsScreen } from './attachmentsScreen'
import { schoolInfoScreen } from './schoolInfoScreen'
import { fishingCompanyInfoScreen } from './fishingCompanyInfoScreen'
import { sportsClubInfoScreen } from './sportsClubInfoScreen'
import { rescueSquadInfoScreen } from './rescueSquadInfoScreen'

export const aboutTheAccidentSection = buildSection({
  id: 'accidentType.section',
  title: accidentType.general.sectionTitle,
  children: [
    accidentTypeScreen,
    workAccidentScreen,
    studiesAccidentScreen,
    locationScreen,
    workMachineScreen,
    accidentDetailsScreen,
    attachmentsScreen,
    schoolInfoScreen,
    fishingCompanyInfoScreen,
    sportsClubInfoScreen,
    rescueSquadInfoScreen,
  ],
})
