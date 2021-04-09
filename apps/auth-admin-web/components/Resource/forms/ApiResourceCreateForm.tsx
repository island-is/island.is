import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiResourcesDTO } from '../../../entities/dtos/api-resources-dto'
import { ResourcesService } from '../../../services/ResourcesService'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'

interface Props {
  handleSave?: (object: ApiResourcesDTO) => void
  handleCancel?: () => void
  apiResource: ApiResourcesDTO
}

const ResourceCreateForm: React.FC<Props> = (props) => {
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
  const [translation] = useState<FormPage>(
    TranslationUtils.getFormPage('ResourceCreateForm'),
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
          <h1>{isEditing ? translation.editTitle : translation.title}</h1>
          <div className="api-resource-form__container__form">
            <div className="api-resource-form__help">{translation.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-resource-form__container__fields">
                <div className="api-resource-form__container__field">
                  <label
                    className="api-resource-form__label"
                    htmlFor="nationalId"
                  >
                    {translation.fields['nationalId'].label}
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
                    placeholder={translation.fields['nationalId'].placeholder}
                    maxLength={10}
                    title={translation.fields['nationalId'].helpText}
                  />
                  <HelpBox
                    helpText={translation.fields['nationalId'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="nationalId"
                    message={translation.fields['nationalId'].helpText}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label className="client-basic__label" htmlFor="contactEmail">
                    {translation.fields['contactEmail'].label}
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
                    title={translation.fields['contactEmail'].helpText}
                    placeholder={translation.fields['contactEmail'].placeholder}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="contactEmail"
                    message={translation.fields['contactEmail'].errorMessage}
                  />
                  <HelpBox
                    helpText={translation.fields['contactEmail'].helpText}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label htmlFor="name" className="api-resource-form__label">
                    {translation.fields['name'].label}
                  </label>
                  <input
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateIdentifier,
                    })}
                    id="name"
                    name="name"
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                    title={translation.fields['name'].helpText}
                    placeholder={translation.fields['name'].placeholder}
                  />
                  <div
                    className={`api-resource-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available
                      ? translation.fields['name'].available
                      : translation.fields['name'].unAvailable}
                  </div>
                  <HelpBox helpText={translation.fields['name'].helpText} />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message={translation.fields['name'].errorMessage}
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="api-resource-form__label"
                  >
                    {translation.fields['displayName'].label}
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
                    title={translation.fields['displayName'].helpText}
                    placeholder={translation.fields['displayName'].placeholder}
                  />
                  <HelpBox
                    helpText={translation.fields['displayName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message={translation.fields['displayName'].errorMessage}
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
                    {translation.fields['description'].label}
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
                    title={translation.fields['description'].helpText}
                  />
                  <HelpBox
                    helpText={translation.fields['description'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message={translation.fields['description'].errorMessage}
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
                    {translation.fields['enabled'].label}
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.apiResource.enabled}
                    className="api-resource-form__checkbox"
                    title={translation.fields['enabled'].helpText}
                  />
                  <HelpBox helpText={translation.fields['enabled'].helpText} />
                </div>

                <div className="api-resource-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-resource-form__label"
                  >
                    {translation.fields['showInDiscoveryDocument'].label}
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={props.apiResource.showInDiscoveryDocument}
                    className="api-resource-form__checkbox"
                    title={
                      translation.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                  <HelpBox
                    helpText={
                      translation.fields['showInDiscoveryDocument'].helpText
                    }
                  />
                </div>

                <div className="api-resource-form__buttons__container">
                  <div className="api-resource-form__button__container">
                    <button
                      type="button"
                      className="api-resource-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      {translation.cancelButton}
                    </button>
                  </div>
                  <div className="api-resource-form__button__container">
                    <input
                      type="submit"
                      className="api-resource-form__button__save"
                      disabled={isSubmitting || !available}
                      value={translation.saveButton}
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

export default ResourceCreateForm
