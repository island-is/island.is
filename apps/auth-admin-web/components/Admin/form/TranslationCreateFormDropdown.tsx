import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import { Language } from '../../../entities/models/language.model'
import { TranslationService } from '../../../services/TranslationService'
import { TranslationDTO } from '../../../entities/dtos/translation.dto'
import { Translation } from '../../../entities/models/translation.model'
import { LanguageDTO } from './../../../entities/dtos/language.dto'

interface Props {
  className: string
  key: string
  property: string
  handleSaveButtonClicked: (translation: TranslationDTO) => void
}

const TranslationCreateFormDropdown: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<LanguageDTO>()
  const { isSubmitting } = formState
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('is')
  const [currentTranslation, setCurrentTranslation] = useState<Translation>(
    new Translation(),
  )
  const [visible, setVisible] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    getLanguages()
    getTranslation()
  }, [])

  const getLanguages = async () => {
    const response = await TranslationService.findAllLanguages()
    if (response) {
      setLanguages(response)
    }
  }

  const getTranslation = async (): Promise<void> => {
    const response = await TranslationService.findTranslation(
      selectedLanguage,
      props.className,
      props.property,
      props.key,
    )
    if (response) {
      setIsEditing(true)
      setCurrentTranslation(response)
    } else {
      setIsEditing(false)
      setCurrentTranslation(new Translation())
    }
  }

  const pushEvent = (response: Translation | null) => {
    // if (response) {
    //   if (props.handleSaveButtonClicked) {
    //     props.handleSaveButtonClicked(response)
    //   }
    //   return response
    // }
  }

  const create = async (data: TranslationDTO): Promise<void> => {
    console.log(data)
    data.className = props.className
    data.key = props.key
    data.property = props.property
    console.log(data)

    if (isEditing) {
      const response = await TranslationService.updateTranslation(data)
      if (response) {
        pushEvent(response)
      }
    } else {
      const response = await TranslationService.createTranslation(data)
      if (response) {
        pushEvent(response)
      }
    }
  }

  const save = async (data: TranslationDTO) => {
    await create(data)
  }

  return (
    <div className="translation-create-form-dropdown">
      <div className="translation-create-form-dropdown__button__show">
        <a
          className="user-claim__button__show"
          onClick={() => setVisible(!visible)}
          title={`Create new Translation`}
        >
          <i className="icon__new"></i>
          <span>Create new Translation</span>
        </a>
      </div>
      <div
        className={`translation-create-form-dropdown__wrapper ${
          visible ? 'show' : 'hidden'
        }`}
      >
        <div className="translation-create-form-dropdown__container">
          <h1>Create a Translation</h1>
          <div className="translation-create-form-dropdown__container__form">
            <div className="translation-create-form-dropdown__help">
              Add new translation by filling out the form
            </div>
            <form onSubmit={handleSubmit(save)}>
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
                    ref={register({
                      required: true,
                    })}
                    defaultValue={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                  >
                    {languages.map((language: Language) => {
                      return (
                        <option value={language.isoKey} key={language.isoKey}>
                          {language.englishDescription}
                        </option>
                      )
                    })}
                  </select>
                  <HelpBox helpText="The language for this translation (iso key in the select box for this language)" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.language"
                    message="Language is required"
                  />
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
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    name="translation.value"
                    defaultValue={currentTranslation.value ?? ''}
                    className="translation-create-form-dropdown__input"
                    title="The translated text in the selected language"
                    placeholder="Some description"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.value"
                    message="The value is required and needs to be in the right format"
                  />
                  <HelpBox helpText="The translated text in the selected language" />
                </div>

                <div className="translation-create-form-dropdown__buttons__container">
                  <div className="translation-create-form-dropdown__button__container">
                    <button
                      className="translation-create-form-dropdown__button__cancel"
                      type="button"
                      onClick={(e) => setVisible(false)}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="translation-create-form-dropdown__button__container">
                    <input
                      type="submit"
                      className="translation-create-form-dropdown__button__save"
                      disabled={isSubmitting}
                      value="Save"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default TranslationCreateFormDropdown
