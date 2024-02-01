import { UniqueIdentifier } from '@dnd-kit/core'
import { IFormBuilder, ILanguage, ITenging } from '../types/interfaces'
import { saveFormSettings } from '../services/apiService'

type ChangeNameAction = {
  type: 'changeName'
  payload: {
    lang: string
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

type AddRemoveDocuments = {
  type: 'addRemoveDocuments'
  payload: {
    documents: string[]
  }
}

type FormSettingsPayload =
  | { property: 'invalidationDate'; value: Date }
  | { property: 'dependencies'; value: ITenging }
  | { property: 'stopProgressOnValidatingStep'; value: boolean }
  | { property: 'applicationsDaysToRemove'; value: number }
  | { property: 'documents'; value: string[] }
  | { property: 'adilar'; value: string[] }
  | { property: 'completedMessage'; value: ILanguage }
  | { property: 'isTranslated'; value: boolean }

type FormSettingsAction = {
  type: 'formSettings'
  payload: FormSettingsPayload
}

type Action =
  | ChangeNameAction
  | ApplicationsDaysToRemoveAction
  | InvalidationDateAction
  | StopProgressOnValidatingStepAction
  | AddRemoveConnectionAction
  | FormSettingsAction
  | AddRemoveDocuments

export function formReducer(formBuilder: IFormBuilder, action: Action) {
  switch (action.type) {
    case 'changeName': {
      const { lang, newName } = action.payload
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          name: {
            ...formBuilder.form.name,
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
      const dependencies = { ...formBuilder.form.dependencies }

      if (active in dependencies) {
        if (!dependencies[active].includes(itemAsString)) {
          dependencies[active] = [...dependencies[active], itemAsString]
        } else {
          dependencies[active] = dependencies[active].filter((t) => t !== item)
          if (dependencies[active].length === 0) {
            delete dependencies[active]
          }
        }
      } else {
        dependencies[active] = [itemAsString]
      }
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          dependencies,
        },
      }
    }

    case 'formSettings': {
      console.log('formReducer formSettings')
      const { property, value } = action.payload
      const { id } = formBuilder.form
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

    case 'addRemoveDocuments': {
      const { documents } = action.payload
      console.log('dasdsa')
      saveFormSettings(formBuilder.form.id, {
        id: formBuilder.form.id,
        documents: documents,
      })
      return {
        ...formBuilder,
        form: {
          ...formBuilder.form,
          documents: documents,
        },
      }
    }
    default:
      return formBuilder
  }
}

// function saveSettings(form: IFormBuilder, property: string, value: unknown) {

// }
