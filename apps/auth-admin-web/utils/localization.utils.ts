import englishTranslations from '../i18n/locales/en.json'
import { Localization } from '../entities/common/Localization'
import { LOCALE_KEY } from '../i18n/locales'

// export type Translation = ITranslation
// export { englishTranslations }

class LocalizationUtils {
  private static DEFAULT_TRANSLATION = englishTranslations

  private static language(): string {
    try {
      return localStorage.getItem(LOCALE_KEY) ?? 'en'
    } catch {
      return 'en'
    }
  }

  private static getActiveLocalization(): Localization {
    if (this.language() === 'en') {
      return this.english()
    } else {
      // TODO: return another language when available
      return this.english()
    }
  }

  private static english(): Localization {
    const english = LocalizationUtils.DEFAULT_TRANSLATION as unknown
    return english as Localization
  }

  public static getLocalization(): Localization {
    return this.getActiveLocalization()
  }

  public static getFormControl(id: string) {
    if (this.language() === 'en') {
      const item = LocalizationUtils.english().formControls.find(
        (x) => x.id === id,
      )
      return item
    }
  }

  public static getListControl(id: string) {
    if (this.language() === 'en') {
      const item = LocalizationUtils.english().listControls.find(
        (x) => x.id === id,
      )
      return item
    }
  }

  public static getPageTitle(pageLocalizationId: string = null) {
    if (pageLocalizationId) {
      return (
        this.getActiveLocalization().title +
        ' - ' +
        this.getActiveLocalization().pages[pageLocalizationId].title
      )
    }
    return this.getActiveLocalization().title
  }

  public static getPage(pathId: string) {
    return this.getActiveLocalization().pages[pathId]
  }
}
export default LocalizationUtils
