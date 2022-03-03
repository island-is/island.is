import { Localization as ITranslation } from '../../entities/common/Localization'

import * as englishTranslations from './en.json'

export type Localization = ITranslation
export default { englishTranslations }
export const LOCALE_KEY = 'locale'
