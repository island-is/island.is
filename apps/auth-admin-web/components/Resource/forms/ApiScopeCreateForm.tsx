import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiScopeDTO } from '../../../entities/dtos/api-scope-dto'
import { ResourcesService } from '../../../services/ResourcesService'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'

interface Props {
  handleSave?: (object: ApiScopeDTO) => void
  handleCancel?: () => void
  apiScope: ApiScopeDTO
}

const ApiScopeCreateForm: React.FC<Props> = (props) => {
  const { register, handleSubmit, errors, formState } = useForm<ApiScopeDTO>()
  const { isSubmitting } = formState
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [available, setAvailable] = useState<boolean>(false)
  const [nameLength, setNameLength] = useState(0)
  const [translation, setTranslation] = useState<FormPage>(
    TranslationUtils.getFormPage('ApiScopeCreateForm'),
  )

  useEffect(() => {
    if (props.apiScope && props.apiScope.name) {
      setIsEditing(true)
      setAvailable(true)
    }
  }, [props.apiScope])

  const checkAvailability = async (name: string) => {
    setNameLength(name.length)
    if (name.length === 0) {
      setAvailable(false)
      return
    }
    const response = await ResourcesService.isScopeNameAvailable(name)
    setAvailable(response)
  }

  const save = async (data: ApiScopeDTO) => {
    let response = null

    if (!isEditing) {
      response = await ResourcesService.createApiScope(data)
    } else {
      response = await ResourcesService.updateApiScope(data)
    }

    if (response) {
      if (props.handleSave) {
        props.handleSave(data)
      }
    }
  }

  return (
    <div className="api-scope-form">
      <div className="api-scope-form__wrapper">
        <div className="api-scope-form__container">
          <h1>{isEditing ? translation.editTitle : translation.title}</h1>
          <div className="api-scope-form__container__form">
            <div className="api-scope-form__help">{translation.help}</div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-scope-form__container__fields">
                <div className="api-scope-form__container__field">
                  <label htmlFor="name" className="api-scope-form__label">
                    {translation.fields['name'].label}
                  </label>
                  <input
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateScope,
                    })}
                    id="name"
                    name="name"
                    type="text"
                    className="api-scope-form__input"
                    defaultValue={props.apiScope.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                    placeholder={translation.fields['name'].placeholder}
                  />
                  <div
                    className={`api-scope-form__container__field__available ${
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
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="api-scope-form__label"
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
                    className="api-scope-form__input"
                    defaultValue={props.apiScope.displayName}
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
                    className="apiscope"
                    property="displayName"
                    isEditing={isEditing}
                    id={props.apiScope.name}
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-scope-form__label"
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
                    defaultValue={props.apiScope.description}
                    className="api-scope-form__input"
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
                    className="apiscope"
                    property="description"
                    isEditing={isEditing}
                    id={props.apiScope.name}
                  />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="enabled" className="api-scope-form__label">
                    {translation.fields['enabled'].label}
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.apiScope.enabled}
                    className="api-scope-form__checkbox"
                    title={translation.fields['enabled'].helpText}
                  />
                  <HelpBox helpText={translation.fields['enabled'].helpText} />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-scope-form__label"
                  >
                    {translation.fields['showInDiscoveryDocument'].label}
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={props.apiScope.showInDiscoveryDocument}
                    className="api-scope-form__checkbox"
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

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="emphasize" className="api-scope-form__label">
                    {translation.fields['emphasize'].label}
                  </label>
                  <input
                    ref={register}
                    id="emphasize"
                    name="emphasize"
                    defaultChecked={props.apiScope.emphasize}
                    type="checkbox"
                    className="api-scope-form__checkbox"
                    title={translation.fields['emphasize'].helpText}
                  />
                  <HelpBox
                    helpText={translation.fields['emphasize'].helpText}
                  />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="required" className="api-scope-form__label">
                    {translation.fields['required'].label}
                  </label>
                  <input
                    ref={register}
                    id="required"
                    name="required"
                    defaultChecked={props.apiScope.required}
                    type="checkbox"
                    className="api-scope-form__checkbox"
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
                      defaultChecked={props.apiScope.grantToLegalGuardians}
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
                      defaultChecked={props.apiScope.grantToProcuringHolders}
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
                        props.apiScope.allowExplicitDelegationGrant
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
                      defaultChecked={props.apiScope.automaticDelegationGrant}
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
                      defaultChecked={props.apiScope.alsoForDelegatedUser}
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

                <div className="api-scope-form__buttons__container">
                  <div className="api-scope-form__button__container">
                    <button
                      type="button"
                      className="api-scope-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      {translation.cancelButton}
                    </button>
                  </div>
                  <div className="api-scope-form__button__container">
                    <input
                      type="submit"
                      className="api-scope-form__button__save"
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

export default ApiScopeCreateForm
