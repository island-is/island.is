import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import { LanguageDTO } from '../../../entities/dtos/language.dto'
import { Language } from '../../../entities/models/language.model'
import { TranslationService } from '../../../services/TranslationService'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  language: LanguageDTO
  handleSaveButtonClicked?: (language: Language) => void
  handleCancel?: () => void
}

interface FormOutput {
  language: LanguageDTO
}

const LanguageCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<FormOutput>()
  const { isSubmitting, errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('LanguageCreateForm'),
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
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="language-create-form__container__form">
            <div className="language-create-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="language-create-form__container__fields">
                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="isoKey"
                  >
                    {localization.fields['isoKey'].label}
                  </label>
                  <input
                    id="isoKey"
                    type="text"
                    {...register('language.isoKey', {
                      required: true,
                      maxLength: 2,
                      minLength: 2,
                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={language.isoKey}
                    className="language-create-form__input"
                    placeholder={localization.fields['isoKey'].placeholder}
                    maxLength={2}
                    title={localization.fields['isoKey'].helpText}
                    readOnly={isEditing}
                  />
                  <HelpBox helpText={localization.fields['isoKey'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.isoKey"
                    message={localization.fields['isoKey'].errorMessage}
                  />
                </div>

                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="description"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    id="description"
                    type="text"
                    {...register('language.description', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={language.description ?? ''}
                    className="language-create-form__input"
                    title={localization.fields['description'].helpText}
                    placeholder={localization.fields['description'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                </div>

                <div className="language-create-form__container__field">
                  <label
                    className="language-create-form__label"
                    htmlFor="englishDescription"
                  >
                    {localization.fields['englishDescription'].label}
                  </label>
                  <input
                    id="englishDescription"
                    type="text"
                    {...register('language.englishDescription', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    defaultValue={language.englishDescription ?? ''}
                    className="language-create-form__input"
                    title={localization.fields['englishDescription'].helpText}
                    placeholder={
                      localization.fields['englishDescription'].placeholder
                    }
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="language.englishDescription"
                    message={
                      localization.fields['englishDescription'].errorMessage
                    }
                  />
                  <HelpBox
                    helpText={
                      localization.fields['englishDescription'].helpText
                    }
                  />
                </div>
              </div>

              <div className="language-create-form__buttons__container">
                <div className="language-create-form__button__container">
                  <button
                    className="language-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="language-create-form__button__container">
                  <input
                    type="submit"
                    className="language-create-form__button__save"
                    disabled={isSubmitting}
                    title={localization.buttons['save'].helpText}
                    value={localization.buttons['save'].text}
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
