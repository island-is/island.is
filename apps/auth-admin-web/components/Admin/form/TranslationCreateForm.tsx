import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import { Language } from '../../../entities/models/language.model'
import { TranslationService } from '../../../services/TranslationService'
import { TranslationDTO } from '../../../entities/dtos/translation.dto'
import { Translation } from '../../../entities/models/translation.model'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'

interface Props {
  translation: TranslationDTO
  handleSaveButtonClicked?: (translation: Translation) => void
  handleCancel?: () => void
}

interface FormOutput {
  translation: Translation
}

const TranslationCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<FormOutput>()
  const { isSubmitting, errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const translation = props.translation
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('is')
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('TranslationCreateForm'),
  )

  useEffect(() => {
    if (props.translation && props.translation.key) {
      setIsEditing(true)
    }
    getLanguages()
  }, [props.translation])

  const getLanguages = async () => {
    const response = await TranslationService.findAllLanguages()
    if (response) {
      setLanguages(response)
    }
  }

  const pushEvent = (response: Translation | null) => {
    if (response) {
      if (props.handleSaveButtonClicked) {
        props.handleSaveButtonClicked(response)
      }
      return response
    }
  }

  const create = async (data: TranslationDTO): Promise<void> => {
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

  const save = async (data: FormOutput) => {
    await create(data.translation)
  }

  return (
    <div className="translation-create-form">
      <div className="translation-create-form__wrapper">
        <div className="translation-create-form__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="translation-create-form__container__form">
            <div className="translation-create-form__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="translation-create-form__container__fields">
                <div className="translation-create-form__container__field">
                  <label
                    className="translation-create-form__label"
                    htmlFor="language"
                  >
                    {localization.fields['language'].label}
                  </label>
                  <select
                    id="language"
                    className="translation-create-form__select"
                    {...register('translation.language', {
                      required: true,
                      onChange: (e) => setSelectedLanguage(e.target.value),
                    })}
                    disabled={isEditing}
                    defaultValue={translation.language}
                    title={localization.fields['language'].helpText}
                  >
                    {languages.map((language: Language) => {
                      return (
                        <option value={language.isoKey} key={language.isoKey}>
                          {language.englishDescription}
                        </option>
                      )
                    })}
                  </select>
                  <HelpBox
                    helpText={localization.fields['language'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.language"
                    message={localization.fields['language'].errorMessage}
                  />
                </div>

                <div className="translation-create-form__container__field">
                  <label
                    className="translation-create-form__label"
                    htmlFor="className"
                  >
                    {localization.fields['className'].label}
                  </label>
                  <input
                    id="className"
                    type="text"
                    disabled={isEditing}
                    {...register('translation.className', {
                      required: true,
                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={translation.className ?? ''}
                    className="translation-create-form__input"
                    title={localization.fields['className'].helpText}
                    placeholder={localization.fields['className'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.className"
                    message={localization.fields['className'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['className'].helpText}
                  />
                </div>

                <div className="translation-create-form__container__field">
                  <label
                    className="translation-create-form__label"
                    htmlFor="property"
                  >
                    {localization.fields['property'].label}
                  </label>
                  <input
                    id="property"
                    type="text"
                    {...register('translation.property', {
                      required: true,
                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateIdentifier,
                    })}
                    defaultValue={translation.property ?? ''}
                    className="translation-create-form__input"
                    title={localization.fields['property'].helpText}
                    placeholder={localization.fields['property'].placeholder}
                    disabled={isEditing}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.property"
                    message={localization.fields['property'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['property'].helpText}
                  />
                </div>
              </div>

              <div className="translation-create-form__container__field">
                <label className="translation-create-form__label" htmlFor="key">
                  {localization.fields['key'].label}
                </label>
                <input
                  id="key"
                  type="text"
                  {...register('translation.key', {
                    required: true,
                    validate: isEditing
                      ? () => {
                          return true
                        }
                      : ValidationUtils.validateIdentifier,
                  })}
                  defaultValue={translation.key ?? ''}
                  className="translation-create-form__input"
                  title={localization.fields['key'].helpText}
                  placeholder={localization.fields['key'].placeholder}
                  disabled={isEditing}
                />
                <ErrorMessage
                  as="span"
                  errors={errors}
                  name="translation.key"
                  message={localization.fields['key'].errorMessage}
                />
                <HelpBox helpText={localization.fields['key'].helpText} />
              </div>

              <div className="translation-create-form__container__field">
                <label
                  className="translation-create-form__label"
                  htmlFor="value"
                >
                  {localization.fields['value'].label}
                </label>
                <input
                  id="value"
                  type="text"
                  {...register('translation.value', {
                    required: true,
                    validate: ValidationUtils.validateDescription,
                  })}
                  defaultValue={translation.value ?? ''}
                  className="translation-create-form__input"
                  title={localization.fields['value'].helpText}
                  placeholder={localization.fields['value'].placeholder}
                />
                <ErrorMessage
                  as="span"
                  errors={errors}
                  name="translation.value"
                  message={localization.fields['value'].errorMessage}
                />
                <HelpBox helpText={localization.fields['value'].helpText} />
              </div>

              <div className="translation-create-form__buttons__container">
                <div className="translation-create-form__button__container">
                  <button
                    className="translation-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="translation-create-form__button__container">
                  <input
                    type="submit"
                    className="translation-create-form__button__save"
                    disabled={isSubmitting}
                    value={localization.buttons['save'].text}
                    title={localization.buttons['save'].helpText}
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
export default TranslationCreateForm
