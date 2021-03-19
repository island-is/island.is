import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import { LanguageDTO } from '../../../entities/dtos/language.dto'
import { Language } from '../../../entities/models/language.model'
import { TranslationService } from '../../../services/TranslationService'

interface Props {
  language: LanguageDTO
  handleSaveButtonClicked?: (language: Language) => void
  handleCancel?: () => void
}

interface FormOutput {
  language: LanguageDTO
}

const LanguageCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const language = props.language

  useEffect(() => {
    if (props.language && props.language.isoKey) {
      setIsEditing(true)
    }
  }, [props.language])

  const pushEvent = (response: Language | null) => {
    if (response) {
      if (props.handleSaveButtonClicked) {
        props.handleSaveButtonClicked(response)
      }
      return response
    }
  }

  const create = async (data: LanguageDTO): Promise<void> => {
    if (isEditing) {
      const response = await TranslationService.updateLanguage(data)
      if (response) {
        pushEvent(response)
      }
    } else {
      const response = await TranslationService.createLanguage(data)
      if (response) {
        pushEvent(response)
      }
    }
  }

  const save = async (data: FormOutput) => {
    await create(data.language)
  }

  return (
    <div className="language-create-form">
      <div className="language-create-form__wrapper">
        <div className="language-create-form__container">
          <h1>{isEditing ? 'Edit Language' : 'Create a new Language'}</h1>
          <div className="language-create-form__container__form">
            <div className="language-create-form__help">
              Add new language by filling out the form
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="language-create-form__container__fields">
                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="isoKey"
                  >
                    ISO 639-1 key
                  </label>
                  <input
                    id="isoKey"
                    type="text"
                    name="language.isoKey"
                    ref={register({
                      required: true,
                      maxLength: 2,
                      minLength: 2,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={language.isoKey}
                    className="language-create-form__input"
                    placeholder="is"
                    maxLength={2}
                    title="The iso key (identifier)  for this language"
                    readOnly={isEditing}
                  />
                  <HelpBox helpText="The iso key (identifier) for this language" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.isoKey"
                    message="The iso key must 2 characters"
                  />
                </div>

                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="description"
                  >
                    Language name
                  </label>
                  <input
                    id="description"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    name="language.description"
                    defaultValue={language.description ?? ''}
                    className="language-create-form__input"
                    title="The language name in it's own language"
                    placeholder="Íslenska"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.description"
                    message="Language name is required and needs to be in the right format"
                  />
                  <HelpBox helpText="The email of the admin user" />
                </div>

                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="englishDescription"
                  >
                    Language name in English
                  </label>
                  <input
                    id="englishDescription"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    name="language.englishDescription"
                    defaultValue={language.englishDescription ?? ''}
                    className="language-create-form__input"
                    title="The language name in English"
                    placeholder="Icelandic"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.englishDescription"
                    message="The language name in English"
                  />
                  <HelpBox helpText="The email of the admin user" />
                </div>
              </div>

              <div className="language-create-form__buttons__container">
                <div className="language-create-form__button__container">
                  <button
                    className="language-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="language-create-form__button__container">
                  <input
                    type="submit"
                    className="language-create-form__button__save"
                    disabled={isSubmitting}
                    value="Save"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default LanguageCreateForm
