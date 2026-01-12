// Widget operations
import { DEFAULT_LOCALE } from '../../../constants'
import markdownEditor from './widgets/markdownEditor'
import multipleLine from './widgets/multipleLine'
import richTextEditor from './widgets/richTextEditor'
import singleLine from './widgets/singleLine'

interface WidgetActions {
  extractText: (value: string) => string[]
  createValue: (translation: string[], scaffold?: any) => any
  ignore?: boolean
}

function isFieldOk(field: any) {
  // Are there two locales?
  // Are they correct?
  if (!field.locales) {
    return false
  }
  if (
    !field.locales.includes('en') ||
    !field.locales.includes(DEFAULT_LOCALE)
  ) {
    return false
  }

  return true
}

function extractField(field: any, eInterface: any, locale = DEFAULT_LOCALE) {
  if (isFieldOk(field)) {
    const { widgetId } = eInterface.controls.filter(
      (a: any) => a['fieldId'] === field.id,
    )[0]

    // Logs to see the different widget types - useful for development
    // console.log("FIELD ID", field.id)
    // console.log("WIDGET-ID", widgetId)

    const { extractText, ignore } = selectWidget(widgetId)
    // ignore: Either not implemented or type not supported
    if (ignore) {
      return
    } else {
      const fieldValue = field.getValue(locale)
      if (fieldValue) {
        const texts = extractText(fieldValue)
        return texts
      } else {
        return []
      }
    }
  }
}

async function populateField(field: any, eInterface: any, texts: string[]) {
  if (isFieldOk(field)) {
    const { widgetId } = eInterface.controls.filter(
      (a: any) => a['fieldId'] === field.id,
    )[0]
    const { createValue, ignore } = selectWidget(widgetId)
    // ignore: Either not implemented or type not supported
    if (ignore) {
      return
    } else {
      // We still need to get the iceValue for those
      // widgets that rely on a scaffold (see RichText)
      const iceValue = field.getValue(DEFAULT_LOCALE)
      if (!iceValue) {
        return
      }
      const enValue = createValue(texts, iceValue)

      // Set the value in contentful
      field.setValue(enValue, 'en')
    }
  }
}

// Returns the widgetObject related to the widgetType
// Every widgetObject has an 'extractText' and 'createValue' function
function selectWidget(widgetId: string): WidgetActions | any {
  switch (widgetId) {
    case 'richTextEditor':
      return richTextEditor
    case 'singleLine':
      return singleLine
    case 'multipleLine':
      return multipleLine
    case 'markdown':
      return markdownEditor
    default:
      return {
        ignore: true,
      }
  }
}

export { extractField, populateField }
