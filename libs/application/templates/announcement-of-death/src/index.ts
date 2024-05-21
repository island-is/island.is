import AnnouncementOfDeathTemplate from './lib/announcementOfDeathTemplate'
import { AnnouncementOfDeath } from './lib/dataSchema'
export const getDataProviders = () => import('./dataProviders/')
export const getFields = () => import('./fields/')

export type AnnouncementOfDeathAnswers = AnnouncementOfDeath

export default AnnouncementOfDeathTemplate
