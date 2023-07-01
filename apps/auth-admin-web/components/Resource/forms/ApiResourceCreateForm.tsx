import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiResourcesDTO } from '../../../entities/dtos/api-resources-dto'
import { ResourcesService } from '../../../services/ResourcesService'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
import HintBox from '../../common/HintBox'

interface Props {
  handleSave?: (object: ApiResourcesDTO) => void
  handleCancel?: () => void
  apiResource: ApiResourcesDTO
}

const ApiResourceCreateForm: React.FC<React.PropsWithChildren<Props>> = (
  props,
) => {
  const { register, handleSubmit, formState } = useForm<ApiResourcesDTO>()
  const { isSubmitting, errors } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [nameLength, setNameLength] = useState(0)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiResourceCreateForm'),
  )
  //#region hint-box
  const [nameHintVisible, setNameHintVisible] = useState<boolean>(false)
  const [nameHintMessage, setNameHintMessage] = useState<string>('')
  const [nameIsValid, setNameIsValid] = useState<boolean | null>(null)
  //#endregion hint-box

  useEffect(() => {
    if (props.apiResource && props.apiResource.name) {
      setIsEditing(true)
      setAvailable(true)
    }
  }, [props.apiResource])

  const onNameChange = async (name: string) => {
    if (isEditing) {
      return
    }
    setNameHintVisible(true)
    const isValid =
      name.length > 0 ? ValidationUtils.validateApiResourceName(name) : false
    setNameIsValid(isValid)
    isValid
      ? setNameHintMessage(localization.fields['name'].hintOkMessage)
      : setNameHintMessage(localization.fields['name'].hintErrorMessage)

    checkAvailability(name)
  }

  const checkAvailability = async (name: string) => {
    setNameLength(name?.length)
    const response = await ResourcesService.getApiResourceByName(name)
    if (response) {
      setAvailable(false)
    } else {
      setAvailable(true)
    }
  }

  const save = async (data: ApiResourcesDTO) => {
    let response = null

    if (!isEditing) {
      response = await ResourcesService.createApiResource(data)
    } else {
      response = await ResourcesService.updateApiResource(data, data.name)
    }

    if (response) {
      if (props.handleSave) {
        props.handleSave(data)
      }
    }
  }

  return (
    <div className="api-resource-form">
      <div className="api-resource-form__wrapper">
        <div className="api-resource-form__container">
          <h1>{isEditing ? localization.editTitle : localization.title}</h1>
          <div className="api-resource-form__container__form">
            <div className="api-resource-form__help">{localization.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-resource-form__container__fields">
                <div className="api-resource-form__container__field">
                  <label
                    className="api-resource-form__label"
                    htmlFor="nationalId"
                  >
                    {localization.fields['nationalId'].label}
                  </label>
                  <input
                    type="text"
                    {...register('nationalId', {
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      validate: ValidationUtils.validateNationalId,
                    })}
                    defaultValue={props.apiResource.nationalId}
                    className="api-resource-form__input"
                    placeholder={localization.fields['nationalId'].placeholder}
                    maxLength={10}
                    title={localization.fields['nationalId'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['nationalId'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="nationalId"
                    message={localization.fields['nationalId'].errorMessage}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    className="api-resource-form__label"
                    htmlFor="contactEmail"
                  >
                    {localization.fields['contactEmail'].label}
                  </label>
                  <input
                    id="contactEmail"
                    type="text"
                    {...register('contactEmail', {
                      required: true,
                      validate: ValidationUtils.validateEmail,
                    })}
                    defaultValue={props.apiResource.contactEmail ?? ''}
                    className="api-resource-form__input"
                    title={localization.fields['contactEmail'].helpText}
                    placeholder={
                      localization.fields['contactEmail'].placeholder
                    }
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="contactEmail"
                    message={localization.fields['contactEmail'].errorMessage}
                  />
                  <HelpBox
                    helpText={localization.fields['contactEmail'].helpText}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label htmlFor="name" className="api-resource-form__label">
                    {localization.fields['name'].label}
                  </label>
                  <input
                    id="name"
                    {...register('name', {
                      required: true,
                      onChange: (e) => onNameChange(e.target.value),
                      onBlur: () => setNameHintVisible(false),
                      validate: isEditing
                        ? () => {
                            return true
                          }
                        : ValidationUtils.validateApiResourceName,
                    })}
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.name}
                    readOnly={isEditing}
                    title={localization.fields['name'].helpText}
                    placeholder={localization.fields['name'].placeholder}
                    onFocus={(e) => onNameChange(e.target.value)}
                  />
                  <div
                    className={`api-resource-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available
                      ? localization.fields['name'].available
                      : localization.fields['name'].unAvailable}
                  </div>
                  <HintBox
                    helpText={nameHintMessage}
                    pattern={localization.fields['name'].pattern}
                    patternText={localization.fields['name'].patternText}
                    setVisible={nameHintVisible}
                    onVisibleChange={(e) => setNameHintVisible(e)}
                    isValid={nameIsValid}
                  />
                  <HelpBox helpText={localization.fields['name'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message={localization.fields['name'].errorMessage}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="api-resource-form__label"
                  >
                    {localization.fields['displayName'].label}
                  </label>
                  <input
                    id="displayName"
                    {...register('displayName', {
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.displayName}
                    title={localization.fields['displayName'].helpText}
                    placeholder={localization.fields['displayName'].placeholder}
                  />
                  <HelpBox
                    helpText={localization.fields['displayName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message={localization.fields['displayName'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="apiresource"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.apiResource.name}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-resource-form__label"
                  >
                    {localization.fields['description'].label}
                  </label>
                  <input
                    id="description"
                    {...register('description', {
                      required: false,
                      validate: ValidationUtils.validateDescription,
                    })}
                    type="text"
                    defaultValue={props.apiResource.description}
                    className="api-resource-form__input"
                    title={localization.fields['description'].helpText}
                  />
                  <HelpBox
                    helpText={localization.fields['description'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message={localization.fields['description'].errorMessage}
                  />
                  <TranslationCreateFormDropdown
                    className="apiresource"
                    property="description"
                    isEditing={isEditing}
                    id={props.apiResource.name}
                  />
                </div>

                <div className="api-resource-form__container__checkbox__field">
                  <label htmlFor="enabled" className="api-resource-form__label">
                    {localization.fields['enabled'].label}
                  </label>
                  <input
                    id="enabled"
                    {...register('enabled')}
                    type="checkbox"
                    defaultChecked={props.apiResource.enabled}
                    className="api-resource-form__checkbox"
                    title={localization.fields['enabled'].helpText}
                  />
                  <HelpBox helpText={localization.fields['enabled'].helpText} />
                </div>

                <div className="api-resource-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-resource-form__label"
                  >
                    {localization.fields['showInDiscoveryDocument'].label}
                  </label>
                  <input
                    id="showInDiscoveryDocument"
                    {...register('showInDiscoveryDocument')}
                    type="checkbox"
                    defaultChecked={props.apiResource.showInDiscoveryDocument}
                    className="api-resource-form__checkbox"
                    title={
                      localization.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                  <HelpBox
                    helpText={
                      localization.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                </div>

                <div className="api-resource-form__buttons__container">
                  <div className="api-resource-form__button__container">
                    <button
                      type="button"
                      className="api-resource-form__button__cancel"
                      onClick={props.handleCancel}
                      title={localization.buttons['cancel'].text}
                    >
                      {localization.buttons['cancel'].text}
                    </button>
                  </div>
                  <div className="api-resource-form__button__container">
                    <input
                      type="submit"
                      className="api-resource-form__button__save"
                      disabled={isSubmitting || !available}
                      title={localization.buttons['save'].helpText}
                      value={localization.buttons['save'].text}
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

export default ApiResourceCreateForm
