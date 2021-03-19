import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import ValidationUtils from '../../../utils/validation.utils'
import { Language } from '../../../entities/models/language.model'
import { TranslationService } from '../../../services/TranslationService'
import { TranslationDTO } from '../../../entities/dtos/translation.dto'
import { Translation } from '../../../entities/models/translation.model'

interface Props {
  translation: TranslationDTO
  handleSaveButtonClicked?: (translation: Translation) => void
  handleCancel?: () => void
}

interface FormOutput {
  translation: Translation
}

const TranslationCreateForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<FormOutput>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const translation = props.translation
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string>('is')

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
          <h1>{isEditing ? 'Edit Translation' : 'Create a new Translation'}</h1>
          <div className="translation-create-form__container__form">
            <div className="translation-create-form__help">
              Add new translation by filling out the form
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="translation-create-form__container__fields">
                <div className="translation-create-form__container__field">
                  <label
                    className="translation-create-form__label"
                    htmlFor="language"
                  >
                    Language
                  </label>
                  <select
                    id="language"
                    className="translation-create-form__select"
                    name="translation.language"
                    disabled={isEditing}
                    ref={register({
                      required: true,
                    })}
                    defaultValue={translation.language}
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
                  <HelpBox helpText="The iso key (identifier) for this language" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.language"
                    message="Language is required"
                  />
                </div>

                <div className="translation-create-form__container__field">
                  <label
                    className="translation-create-form__label"
                    htmlFor="className"
                  >
                    Class Name
                  </label>
                  <input
                    id="className"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    disabled={isEditing}
                    name="translation.className"
                    defaultValue={translation.className ?? ''}
                    className="translation-create-form__input"
                    title="The name of the class (entity/model) that this translation belongs to"
                    placeholder="Client"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.className"
                    message="The class name is required and needs to be in the right format"
                  />
                  <HelpBox helpText="The name of the class (entity/model) that this translation belongs to" />
                </div>

                <div className="translation-create-form__container__field">
                  <label
                    className="translation-create-form__label"
                    htmlFor="property"
                  >
                    Property
                  </label>
                  <input
                    id="property"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    name="translation.property"
                    defaultValue={translation.property ?? ''}
                    className="translation-create-form__input"
                    title="The property with in the class that is being translated"
                    placeholder="description"
                    disabled={isEditing}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="translation.property"
                    message="The property is required and needs to be in the right format"
                  />
                  <HelpBox helpText="The property with in the class that is being translated" />
                </div>
              </div>

              <div className="translation-create-form__container__field">
                <label className="translation-create-form__label" htmlFor="key">
                  Key
                </label>
                <input
                  id="key"
                  type="text"
                  ref={register({
                    required: true,
                    validate: ValidationUtils.validateIdentifier,
                  })}
                  name="translation.key"
                  defaultValue={translation.key ?? ''}
                  className="translation-create-form__input"
                  title="The key of the item that is being translated"
                  placeholder="island-is-1"
                  disabled={isEditing}
                />
                <ErrorMessage
                  as="span"
                  errors={errors}
                  name="translation.key"
                  message="The key is required and needs to be in the right format"
                />
                <HelpBox helpText="The key of the item that is being translated" />
              </div>

              <div className="translation-create-form__container__field">
                <label
                  className="translation-create-form__label"
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
                  defaultValue={translation.value ?? ''}
                  className="translation-create-form__input"
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

              <div className="translation-create-form__buttons__container">
                <div className="translation-create-form__button__container">
                  <button
                    className="translation-create-form__button__cancel"
                    type="button"
                    onClick={props.handleCancel}
                  >
                    Cancel
                  </button>
                </div>
                <div className="translation-create-form__button__container">
                  <input
                    type="submit"
                    className="translation-create-form__button__save"
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
export default TranslationCreateForm
