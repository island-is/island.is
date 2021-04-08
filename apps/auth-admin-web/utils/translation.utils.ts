import englishTranslations from './../i18n/locales/en.json'
import { Translation } from './../entities/common/Translation'
import { LOCALE_KEY } from '../i18n/locales'

// export type Translation = ITranslation
// export { englishTranslations }

class TranslationUtils {
  private static DEFAULT_TRANSLATION = englishTranslations

  private static language(): string {
    return localStorage.getItem(LOCALE_KEY) ?? 'en'
  }

  private static english(): Translation {
    const english = TranslationUtils.DEFAULT_TRANSLATION as unknown
    return english as Translation
  }

  public static getFormPage(id: string) {
    if (this.language() === 'en') {
      const item = TranslationUtils.english().formPages.find((x) => x.id === id)
      console.log(item)
      return item
    }
  }
}
export default TranslationUtils
