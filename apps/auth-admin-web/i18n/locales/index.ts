import * as englishTranslations from './en.json'
import { Localization as ITranslation } from '../../entities/common/Localization'

export type Localization = ITranslation
export default { englishTranslations }
export const LOCALE_KEY = 'locale'
