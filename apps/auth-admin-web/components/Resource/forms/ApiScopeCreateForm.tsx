import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiScopeDTO } from '../../../entities/dtos/api-scope-dto'
import { ResourcesService } from '../../../services/ResourcesService'
import ValidationUtils from './../../../utils/validation.utils'

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
          <h1>{isEditing ? 'Edit Api Scope' : 'Create Api Scope'}</h1>
          <div className="api-scope-form__container__form">
            <div className="api-scope-form__help">
              Scope is a mechanism in OAuth 2.0 to limit an application's access
              to a user's account. An application can request one or more
              scopes, this information is then presented to the user in the
              consent screen, and the access token issued to the application
              will be limited to the scopes granted.
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-scope-form__container__fields">
                <div className="api-scope-form__container__field">
                  <label htmlFor="name" className="api-scope-form__label">
                    Name
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
                  />
                  <div
                    className={`api-scope-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available ? 'Available' : 'Unavailable'}
                  </div>
                  <HelpBox helpText="The unique name of the scope. This is the value a client will use for the scope parameter in the authorize/token request." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message="Name is required and needs to be in the right format"
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="api-scope-form__label"
                  >
                    Display Name
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
                  />
                  <HelpBox helpText="The Display Name value can be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message="Display name is required and can not contain special characters"
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-scope-form__label"
                  >
                    Description
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
                  />
                  <HelpBox helpText="The Description value can be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message="Description can not contain special characters"
                  />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="enabled" className="api-scope-form__label">
                    Enabled
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.apiScope.enabled}
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies if the scope is enabled" />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-scope-form__label"
                  >
                    Show In Discovery Document
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={props.apiScope.showInDiscoveryDocument}
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether this scope is shown in the discovery document." />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="emphasize" className="api-scope-form__label">
                    Emphasize
                  </label>
                  <input
                    ref={register}
                    id="emphasize"
                    name="emphasize"
                    defaultChecked={props.apiScope.emphasize}
                    type="checkbox"
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes" />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="required" className="api-scope-form__label">
                    Required
                  </label>
                  <input
                    ref={register}
                    id="required"
                    name="required"
                    defaultChecked={props.apiScope.required}
                    type="checkbox"
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether the user can de-select the scope on the consent screen (if the consent screen wants to implement such a feature)" />
                </div>

                <section className="api-scope__section">
                  <h3>Delegation</h3>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="grantToLegalGuardians"
                      className="api-scope-form__label"
                    >
                      Grant To Legal Guardians
                    </label>
                    <input
                      ref={register}
                      id="grantToLegalGuardians"
                      name="grantToLegalGuardians"
                      type="checkbox"
                      defaultChecked={props.apiScope.grantToLegalGuardians}
                      className="api-scope-form__checkbox"
                      title="Should legal guardians automatically get this scope for their wards"
                    />
                    <HelpBox helpText="Should legal guardians automatically get this scope for their wards" />
                  </div>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="grantToProcuringHolders"
                      className="api-scope-form__label"
                    >
                      Grant To Procuring Holders
                    </label>
                    <input
                      ref={register}
                      id="grantToProcuringHolders"
                      name="grantToProcuringHolders"
                      type="checkbox"
                      defaultChecked={props.apiScope.grantToProcuringHolders}
                      className="api-scope-form__checkbox"
                      title="Should procuring holders automatically get this scope for their organisations"
                    />
                    <HelpBox helpText="Should procuring holders automatically get this scope for their organisations" />
                  </div>
                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="allowExplicitDelegationGrant"
                      className="api-scope-form__label"
                    >
                      Allow Explicit Delegation Grant
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
                      title="Should identities be able to delegate this scope to other users. Some scopes should not support delegation"
                    />
                    <HelpBox helpText="Should identities be able to delegate this scope to other users. Some scopes should not support delegation" />
                  </div>
                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="automaticDelegationGrant"
                      className="api-scope-form__label"
                    >
                      Automatic Delegation Grant
                    </label>
                    <input
                      ref={register}
                      id="automaticDelegationGrant"
                      name="automaticDelegationGrant"
                      type="checkbox"
                      defaultChecked={props.apiScope.automaticDelegationGrant}
                      className="api-scope-form__checkbox"
                      title="Should this scope always be granted if a user has any other delegation grants. Mostly valid for system scopes. Let's say someone has a delegation grant for the @island.is/bills scope, they should automatically get the profile scope to look up the delegating identity's profile"
                    />
                    <HelpBox helpText="Should this scope always be granted if a user has any other delegation grants. Mostly valid for system scopes. Let's say someone has a delegation grant for the @island.is/bills scope, they should automatically get the profile scope to look up the delegating identity's profile" />
                  </div>

                  <div className="api-scope-form__container__checkbox__field">
                    <label
                      htmlFor="alsoForDelegatedUser"
                      className="api-scope-form__label"
                    >
                      Also For Delegated User
                    </label>
                    <input
                      ref={register}
                      id="alsoForDelegatedUser"
                      name="alsoForDelegatedUser"
                      type="checkbox"
                      defaultChecked={props.apiScope.alsoForDelegatedUser}
                      className="api-scope-form__checkbox"
                      title="Should this scope be kept around for the delegated user. Mostly valid for system scopes. When authenticated as a delegating identity, all non-required scopes are removed from the top-level scope array, indicating that the access token can mainly be used to get resources for the delegating identity"
                    />
                    <HelpBox helpText="Should this scope be kept around for the delegated user. Mostly valid for system scopes. When authenticated as a delegating identity, all non-required scopes are removed from the top-level scope array, indicating that the access token can mainly be used to get resources for the delegating identity" />
                  </div>
                </section>

                <div className="api-scope-form__buttons__container">
                  <div className="api-scope-form__button__container">
                    <button
                      type="button"
                      className="api-scope-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="api-scope-form__button__container">
                    <input
                      type="submit"
                      className="api-scope-form__button__save"
                      disabled={isSubmitting || !available}
                      value="Next"
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
