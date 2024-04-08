/* eslint-disable func-style */
import { UniqueIdentifier } from '@dnd-kit/core'
import {
  ICertificate,
  IFormBuilder,
  ILanguage,
  ITenging,
} from '../types/interfaces'
import { saveFormSettings } from '../services/apiService'

type ILang = 'is' | 'en'

type ChangeNameAction = {
  type: 'changeName'
  payload: {
    lang: ILang
    newName: string
  }
}

type ApplicationsDaysToRemoveAction = {
  type: 'applicationsDaysToRemove'
  payload: {
    value: number
  }
}

type InvalidationDateAction = {
  type: 'invalidationDate'
  payload: {
    value: Date
  }
}

type StopProgressOnValidatingStepAction = {
  type: 'stopProgressOnValidatingStep'
  payload: {
    value: boolean
  }
}

type AddRemoveConnectionAction = {
  type: 'addRemoveConnection'
  payload: {
    active: UniqueIdentifier
    item: UniqueIdentifier
  }
}

type UpdateDocuments = {
  type: 'updateDocuments'
  payload: {
    documents: ICertificate[]
  }
}

type FormSettingsPayload =
  | { property: 'invalidationDate'; value: Date }
  | { property: 'dependencies'; value: ITenging }
  | { property: 'stopProgressOnValidatingStep'; value: boolean }
  | { property: 'applicationsDaysToRemove'; value: number }
  | {
    property: 'formDocumentTypes'
    value: { formId: number; documentTypeId: number }[]
  }
  | { property: 'adilar'; value: string[] }
  | { property: 'completedMessage'; value: ILanguage }
  | { property: 'isTranslated'; value: boolean }

type FormSettingsAction = {
  type: 'formSettings'
  payload: FormSettingsPayload
}

export type FormAction =
  | ChangeNameAction
  | ApplicationsDaysToRemoveAction
  | InvalidationDateAction
  | StopProgressOnValidatingStepAction
  | AddRemoveConnectionAction
  | FormSettingsAction
  | UpdateDocuments

export function formReducer(formBuilder: IFormBuilder, action: FormAction) {
  switch (action.type) {
    case 'changeName': {
      const { lang, newName } = action.payload
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          name: {
            ...formBuilder.form?.name,
            [lang]: newName,
          },
        },
      }
    }
    case 'applicationsDaysToRemove': {
      const { value } = action.payload
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          applicationsDaysToRemove: value,
        },
      }
    }
    case 'invalidationDate': {
      const { value } = action.payload
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          invalidationDate: value,
        },
      }
    }
    case 'stopProgressOnValidatingStep': {
      const { value } = action.payload
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          stopProgressOnValidatingStep: value,
        },
      }
    }
    case 'addRemoveConnection': {
      const { active, item } = action.payload
      const itemAsString = String(item)
      const dependencies = { ...formBuilder.form?.dependencies }

      if (active in dependencies) {
        if (!dependencies[active].includes(itemAsString)) {
          dependencies[active] = [...dependencies[active], itemAsString]
        } else {
          dependencies[active] = dependencies[active].filter((t: UniqueIdentifier) => t !== item)
          if (dependencies[active].length === 0) {
            delete dependencies[active]
          }
        }
      } else {
        dependencies[active] = [itemAsString]
      }
      saveFormSettings(formBuilder.form?.id ?? 0, {
        id: formBuilder.form?.id ?? 0,
        dependencies: dependencies,
      })
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          dependencies,
        },
      }
    }

    case 'formSettings': {
      const { property, value } = action.payload
      const id = formBuilder.form?.id ?? 0
      saveFormSettings(id, {
        id: id,
        [property]: value,
      })
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          [property]: value,
        },
      }
    }

    case 'updateDocuments': {
      const { documents } = action.payload
      const saveDocuments = documents.map((d) => {
        return {
          formId: formBuilder.form?.id ?? 0,
          documentTypeId: d.id,
        }
      })
      saveFormSettings(formBuilder.form?.id ?? 0, {
        id: formBuilder.form?.id ?? 0,
        formDocumentTypes: saveDocuments,
      })
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          documentTypes: documents,
        },
      }
    }

    default:
      return formBuilder
  }
}
