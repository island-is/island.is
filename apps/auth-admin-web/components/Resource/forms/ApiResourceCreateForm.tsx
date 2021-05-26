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

interface Props {
  handleSave?: (object: ApiResourcesDTO) => void
  handleCancel?: () => void
  apiResource: ApiResourcesDTO
}

const ApiResourceCreateForm: React.FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<ApiResourcesDTO>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [nameLength, setNameLength] = useState(0)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ApiResourceCreateForm'),
  )

  useEffect(() => {
    if (props.apiResource && props.apiResource.name) {
      setIsEditing(true)
      setAvailable(true)
    }
  }, [props.apiResource])

  const checkAvailability = async (name: string) => {
    setNameLength(name.length)
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
                    name="nationalId"
                    ref={register({
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
                    message={localization.fields['nationalId'].helpText}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label className="client-basic__label" htmlFor="contactEmail">
                    {localization.fields['contactEmail'].label}
                  </label>
                  <input
                    id="contactEmail"
                    type="text"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateEmail,
                    })}
                    name="contactEmail"
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
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateScope,
                    })}
                    id="name"
                    name="name"
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                    title={localization.fields['name'].helpText}
                    placeholder={localization.fields['name'].placeholder}
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
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateDescription,
                    })}
                    id="displayName"
                    name="displayName"
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
                    ref={register({
                      required: false,
                      validate: ValidationUtils.validateDescription,
                    })}
                    id="description"
                    name="description"
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
                    ref={register}
                    id="enabled"
                    name="enabled"
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
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
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
