import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import { LanguageDTO } from '../../../entities/dtos/language.dto'
import { Language } from '../../../entities/models/language.model'
import { TranslationService } from '../../../services/TranslationService'
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'

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
  const [translation] = useState<FormPage>(
    TranslationUtils.getFormPage('LanguageCreateForm'),
  )
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
          <h1>{isEditing ? translation.editTitle : translation.title}</h1>
          <div className="language-create-form__container__form">
            <div className="language-create-form__help">{translation.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="language-create-form__container__fields">
                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="isoKey"
                  >
                    {translation.fields['isoKey'].label}
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
                    placeholder={translation.fields['isoKey'].placeholder}
                    maxLength={2}
                    title={translation.fields['isoKey'].helpText}
                    readOnly={isEditing}
                  />
                  <HelpBox helpText={translation.fields['isoKey'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.isoKey"
                    message={translation.fields['isoKey'].errorMessage}
                  />
                </div>

                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="description"
                  >
                    {translation.fields['description'].label}
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
                    title={translation.fields['description'].helpText}
                    placeholder={translation.fields['description'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.description"
                    message={translation.fields['description'].errorMessage}
                  />
                  <HelpBox
                    helpText={translation.fields['description'].helpText}
                  />
                </div>

                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="englishDescription"
                  >
                    {translation.fields['englishDescription'].label}
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
                    title={translation.fields['englishDescription'].helpText}
                    placeholder={
                      translation.fields['englishDescription'].placeholder
                    }
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.englishDescription"
                    message={
                      translation.fields['englishDescription'].errorMessage
                    }
                  />
                  <HelpBox
                    helpText={translation.fields['englishDescription'].helpText}
                  />
                </div>
              </div>

              <div className="language-create-form__buttons__container">
                <div className="language-create-form__button__container">
                  <button
                    className="language-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    {translation.cancelButton}
                  </button>
                </div>
                <div className="language-create-form__button__container">
                  <input
                    type="submit"
                    className="language-create-form__button__save"
                    disabled={isSubmitting}
                    value={translation.saveButton}
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
