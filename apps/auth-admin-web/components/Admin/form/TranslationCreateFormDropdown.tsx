import React, { useEffect, useState } from 'react'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import { Language } from '../../../entities/models/language.model'
import { TranslationService } from '../../../services/TranslationService'
import { TranslationDTO } from '../../../entities/dtos/translation.dto'

interface Props {
  className: string
  id: string
  property: string
  isEditing: boolean
}

const TranslationCreateFormDropdown: React.FC<Props> = (props: Props) => {
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('is')
  const [visible, setVisible] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [translationValue, setTranslationValue] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [infoMessage, setInfoMessage] = useState<string>(null)

  useEffect(() => {
    if (props.isEditing) {
      getLanguages()
      getTranslation(selectedLanguage)
    }
  }, [props.id, props.isEditing])

  const getLanguages = async () => {
    const response = await TranslationService.findAllLanguages()
    if (response) {
      setLanguages(response)
    }
  }

  const getTranslation = async (isoKey: string): Promise<void> => {
    const response = await TranslationService.findTranslation(
      isoKey,
      props.className,
      props.property,
      props.id,
    )
    if (response) {
      setIsEditing(true)
      setTranslationValue(response.value)
    } else {
      setIsEditing(false)
      setTranslationValue(null)
    }
  }

  const create = async (textValue: string): Promise<void> => {
    const data = new TranslationDTO()
    data.className = props.className
    data.key = props.id
    data.property = props.property
    data.value = textValue
    data.language = selectedLanguage

    if (isEditing) {
      const response = await TranslationService.updateTranslation(data)
      if (response) {
        setInfoMessage(
          `Translation has been updated for ${
            languages.find((x) => x.isoKey === data.language).englishDescription
          }`,
        )
      }
    } else {
      const response = await TranslationService.createTranslation(data)
      if (response) {
        setInfoMessage(
          `Translation has been created for ${
            languages.find((x) => x.isoKey === data.language).englishDescription
          }`,
        )
      }
    }
  }

  const save = async (event) => {
    if (ValidationUtils.validateDescription(translationValue)) {
      setErrorMessage('')
      create(translationValue)
    } else {
      setErrorMessage('Value is Required and need to be in the right format')
    }
  }

  const switchLanguge = (isoKey: string) => {
    setSelectedLanguage(isoKey)
    getTranslation(isoKey)
    setInfoMessage(null)
  }

  const validate = (value: string) => {
    setTranslationValue(value)
    if (ValidationUtils.validateDescription(translationValue)) {
      setErrorMessage('')
    } else {
      setErrorMessage('Value is required and need to be in the right format')
    }
  }

  const handleTextValueChange = async (value: string) => {
    setTranslationValue(value)
    validate(value)
  }

  const close = () => {
    setInfoMessage(null)
    setVisible(false)
  }

  return (
    <div className="translation-create-form-dropdown">
      <div className="translation-create-form-dropdown__button__show">
        <a
          className="user-claim__button__show"
          onClick={() => (visible ? close() : setVisible(true))}
          title={`Create new Translation`}
        >
          <i className="icon__translation"></i>
          <span>Create new Translation</span>
        </a>
      </div>
      <div
        className={`translation-create-form-dropdown__wrapper ${
          visible ? 'show' : 'hidden'
        }`}
      >
        <div className="translation-create-form-dropdown__button__close">
          <a onClick={close}>
            <i className="icon__close"></i>
          </a>
        </div>
        <div className="translation-create-form-dropdown__container">
          <h1>Create a Translation</h1>

          <div
            className={`translation-create-form-dropdown__container__help-text ${
              props.isEditing ? 'hidden' : 'show'
            }`}
          >
            The item you are creating needs to be saved before creating
            translations
          </div>

          <div
            className={`translation-create-form-dropdown__saved__message ${
              infoMessage ? 'show' : 'hidden'
            }`}
          >
            {infoMessage}
          </div>
          <div
            className={`translation-create-form-dropdown__container__form ${
              props.isEditing ? 'show' : 'hidden'
            }`}
          >
            <div className="translation-create-form-dropdown__help">
              Add new translation by filling out the form
            </div>

            <div className="translation-create-form-dropdown__container__fields">
              <div className="translation-create-form-dropdown__container__field">
                <label
                  className="translation-create-form-dropdown__label"
                  htmlFor="language"
                >
                  Language
                </label>
                <select
                  id="language"
                  className="translation-create-form-dropdown__select"
                  name="translation.language"
                  onChange={(e) => switchLanguge(e.target.value)}
                >
                  {languages.map((language: Language) => {
                    return (
                      <option
                        value={language.isoKey}
                        key={language.isoKey}
                        selected={selectedLanguage === language.isoKey}
                      >
                        {language.englishDescription}
                      </option>
                    )
                  })}
                </select>
                <HelpBox helpText="The language for this translation (iso key in the select box for this language)" />
              </div>

              <div className="translation-create-form-dropdown__container__field">
                <label
                  className="translation-create-form-dropdown__label"
                  htmlFor="value"
                >
                  Value
                </label>
                <input
                  id="value"
                  type="text"
                  name="translation.value"
                  value={translationValue ?? ''}
                  className="translation-create-form-dropdown__input"
                  title="The translated text in the selected language"
                  placeholder="Some description"
                  onChange={(e) => handleTextValueChange(e.target.value)}
                />

                <HelpBox helpText="The translated text in the selected language" />
                <div className="customErrorMessage">{errorMessage}</div>
              </div>

              <div className="translation-create-form-dropdown__buttons__container">
                <div className="translation-create-form-dropdown__button__container">
                  <button
                    className="translation-create-form-dropdown__button__cancel"
                    type="button"
                    onClick={close}
                  >
                    Cancel
                  </button>
                </div>
                <div className="translation-create-form-dropdown__button__container">
                  <button
                    type="button"
                    className="translation-create-form-dropdown__button__save"
                    value="Save"
                    onClick={save}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TranslationCreateFormDropdown
