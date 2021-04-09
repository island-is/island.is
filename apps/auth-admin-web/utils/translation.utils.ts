import englishTranslations from './../i18n/locales/en.json'
import { Translation } from './../entities/common/Translation'
import { LOCALE_KEY } from '../i18n/locales'

// export type Translation = ITranslation
// export { englishTranslations }

class TranslationUtils {
  private static DEFAULT_TRANSLATION = englishTranslations

  private static language(): string {
    try {
      return localStorage.getItem(LOCALE_KEY) ?? 'en'
    } catch {
      return 'en'
    }
  }

  private static getActiveTranslation(): Translation {
    if (this.language() === 'en') {
      return this.english()
    } else {
      // return another language when available
      return this.english()
    }
  }

  private static english(): Translation {
    const english = TranslationUtils.DEFAULT_TRANSLATION as unknown
    return english as Translation
  }

  public static getTranslation(): Translation {
    return this.getActiveTranslation()
  }

  public static getFormPage(id: string) {
    if (this.language() === 'en') {
      const item = TranslationUtils.english().formPages.find((x) => x.id === id)
      return item
    }
  }

  public static getListPage(id: string) {
    if (this.language() === 'en') {
      const item = TranslationUtils.english().listPages.find((x) => x.id === id)
      return item
    }
  }
}
export default TranslationUtils
