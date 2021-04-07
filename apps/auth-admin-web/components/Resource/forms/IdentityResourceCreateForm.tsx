import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ResourcesService } from '../../../services/ResourcesService'
import IdentityResourceDTO from '../../../entities/dtos/identity-resource.dto'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
import { FormPage } from './../../../entities/common/Translation'
import TranslationUtils from './../../../utils/translation.utils'

interface Props {
  handleSave?: (object: IdentityResourceDTO) => void
  handleCancel?: () => void
  identityResource: IdentityResourceDTO
}

const IdentityResourceCreateForm: React.FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<IdentityResourceDTO>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [nameLength, setNameLength] = useState(0)
  const [translation, setTranslation] = useState<FormPage>(
    TranslationUtils.getFormPage('IdentityResourceCreateForm'),
  )

  useEffect(() => {
    if (props.identityResource && props.identityResource.name) {
      setIsEditing(true)
      setAvailable(true)
    }
  }, [props.identityResource])

  const checkAvailability = async (name: string) => {
    setNameLength(name.length)
    if (name.length === 0) {
      setAvailable(false)
      return
    }
    const response = await ResourcesService.isScopeNameAvailable(name)
    setAvailable(response)
  }

  const save = async (data: IdentityResourceDTO) => {
    let response = null

    if (!isEditing) {
      response = await ResourcesService.createIdentityResource(data)
    } else {
      response = await ResourcesService.updateIdentityResource(data, data.name)
    }

    if (response) {
      if (props.handleSave) {
        props.handleSave(data)
      }
    }
  }

  return (
    <div className="identity-resource-form">
      <div className="identity-resource-form__wrapper">
        <div className="identity-resource-form__container">
          <h1>{isEditing ? translation.editTitle : translation.title}</h1>
          <div className="identity-resource-form__container__form">
            <div className="identity-resource-form__help">
              {translation.help}
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="identity-resource-form__container__fields">
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="name"
                    className="identity-resource-form__label"
                  >
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
                    className="identity-resource-form__input"
                    defaultValue={props.identityResource.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                    placeholder={translation.fields['name'].placeholder}
                  />
                  <div
                    className={`identity-resource-form__container__field__available ${
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
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="identity-resource-form__label"
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
                    className="identity-resource-form__input"
                    defaultValue={props.identityResource.displayName}
                    placeholder={translation.fields['displayName'].placeholder}
                    title={translation.fields['displayName'].helpText}
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
                    className="identityresource"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.identityResource.name}
                  />
                </div>
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="description"
                    className="identity-resource-form__label"
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
                    defaultValue={props.identityResource.description}
                    className="identity-resource-form__input"
                    placeholder={translation.fields['description'].placeholder}
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
                    className="identityresource"
                    property="description"
                    isEditing={isEditing}
                    id={props.identityResource.name}
                  />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="enabled"
                    className="identity-resource-form__label"
                  >
                    {translation.fields['enabled'].label}
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.identityResource.enabled}
                    className="identity-resource-form__checkbox"
                    title={translation.fields['enabled'].helpText}
                  />
                  <HelpBox helpText={translation.fields['enabled'].helpText} />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="identity-resource-form__label"
                  >
                    {translation.fields['showInDiscoveryDocument'].label}
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={
                      props.identityResource.showInDiscoveryDocument
                    }
                    className="identity-resource-form__checkbox"
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

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="emphasize"
                    className="identity-resource-form__label"
                  >
                    {translation.fields['emphasize'].label}
                  </label>
                  <input
                    ref={register}
                    id="emphasize"
                    name="emphasize"
                    defaultChecked={props.identityResource.emphasize}
                    type="checkbox"
                    className="identity-resource-form__checkbox"
                    title={translation.fields['emphasize'].helpText}
                  />
                  <HelpBox
                    helpText={translation.fields['emphasize'].helpText}
                  />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="required"
                    className="identity-resource-form__label"
                  >
                    {translation.fields['required'].label}
                  </label>
                  <input
                    ref={register}
                    id="required"
                    name="required"
                    defaultChecked={props.identityResource.required}
                    type="checkbox"
                    className="identity-resource-form__checkbox"
                    title={translation.fields['required'].helpText}
                  />
                  <HelpBox helpText={translation.fields['required'].helpText} />
                </div>

                <section className="api-scope__section">
                  <h3>{translation.sectionTitle1}</h3>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="grantToLegalGuardians"
                      className="api-scope-form__label"
                    >
                      {translation.fields['grantToLegalGuardians'].label}
                    </label>
                    <input
                      ref={register}
                      id="grantToLegalGuardians"
                      name="grantToLegalGuardians"
                      type="checkbox"
                      defaultChecked={
                        props.identityResource.grantToLegalGuardians
                      }
                      className="api-scope-form__checkbox"
                      title={
                        translation.fields['grantToLegalGuardians'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        translation.fields['grantToLegalGuardians'].helpText
                      }
                    />
                  </div>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="grantToProcuringHolders"
                      className="api-scope-form__label"
                    >
                      {translation.fields['grantToProcuringHolders'].label}
                    </label>
                    <input
                      ref={register}
                      id="grantToProcuringHolders"
                      name="grantToProcuringHolders"
                      type="checkbox"
                      defaultChecked={
                        props.identityResource.grantToProcuringHolders
                      }
                      className="api-scope-form__checkbox"
                      title={
                        translation.fields['grantToProcuringHolders'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        translation.fields['grantToProcuringHolders'].helpText
                      }
                    />
                  </div>
                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="allowExplicitDelegationGrant"
                      className="api-scope-form__label"
                    >
                      {translation.fields['allowExplicitDelegationGrant'].label}
                    </label>
                    <input
                      ref={register}
                      id="allowExplicitDelegationGrant"
                      name="allowExplicitDelegationGrant"
                      type="checkbox"
                      defaultChecked={
                        props.identityResource.allowExplicitDelegationGrant
                      }
                      className="api-scope-form__checkbox"
                      title={
                        translation.fields['allowExplicitDelegationGrant']
                          .helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        translation.fields['allowExplicitDelegationGrant']
                          .helpText
                      }
                    />
                  </div>
                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="automaticDelegationGrant"
                      className="api-scope-form__label"
                    >
                      {translation.fields['automaticDelegationGrant'].label}
                    </label>
                    <input
                      ref={register}
                      id="automaticDelegationGrant"
                      name="automaticDelegationGrant"
                      type="checkbox"
                      defaultChecked={
                        props.identityResource.automaticDelegationGrant
                      }
                      className="api-scope-form__checkbox"
                      title={
                        translation.fields['automaticDelegationGrant'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        translation.fields['automaticDelegationGrant'].helpText
                      }
                    />
                  </div>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="alsoForDelegatedUser"
                      className="api-scope-form__label"
                    >
                      {translation.fields['alsoForDelegatedUser'].label}
                    </label>
                    <input
                      ref={register}
                      id="alsoForDelegatedUser"
                      name="alsoForDelegatedUser"
                      type="checkbox"
                      defaultChecked={
                        props.identityResource.alsoForDelegatedUser
                      }
                      className="api-scope-form__checkbox"
                      title={
                        translation.fields['alsoForDelegatedUser'].helpText
                      }
                    />
                    <HelpBox
                      helpText={
                        translation.fields['alsoForDelegatedUser'].helpText
                      }
                    />
                  </div>
                </section>

                <div className="identity-resource-form__buttons__container">
                  <div className="identity-resource-form__button__container">
                    <button
                      type="button"
                      className="identity-resource-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      {translation.cancelButton}
                    </button>
                  </div>
                  <div className="identity-resource-form__button__container">
                    <input
                      type="submit"
                      className="identity-resource-form__button__save"
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

export default IdentityResourceCreateForm
