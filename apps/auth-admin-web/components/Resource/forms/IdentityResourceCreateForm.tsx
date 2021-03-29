import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ResourcesService } from '../../../services/ResourcesService'
import IdentityResourceDTO from '../../../entities/dtos/identity-resource.dto'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationCreateFormDropdown from '../../Admin/form/TranslationCreateFormDropdown'

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
          <h1>
            {isEditing ? 'Edit Identity Resource' : 'Create Identity Resource'}
          </h1>
          <div className="identity-resource-form__container__form">
            <div className="identity-resource-form__help">
              Identity resources are data like user ID, name, or email address
              of a user. An identity resource has a unique name, and you can
              assign arbitrary claim types to it. These claims will then be
              included in the identity token for the user. The client will use
              the scope parameter to request access to an identity resource.
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="identity-resource-form__container__fields">
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="name"
                    className="identity-resource-form__label"
                  >
                    Name
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
                  />
                  <div
                    className={`identity-resource-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available ? 'Available' : 'Unavailable'}
                  </div>
                  <HelpBox helpText="The unique name of the identity resource. This is the value a client will use for the scope parameter in the authorize request." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message="Name is required and needs to be in the right format"
                  />
                </div>
                <div className="identity-resource-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="identity-resource-form__label"
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
                    className="identity-resource-form__input"
                    defaultValue={props.identityResource.displayName}
                  />
                  <HelpBox helpText="The display name value will be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message="Display name is required and needs to be in the right format"
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
                    defaultValue={props.identityResource.description}
                    className="identity-resource-form__input"
                  />
                  <HelpBox helpText="The description value will be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message="Description needs to be in the right format"
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
                    Enabled
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.identityResource.enabled}
                    className="identity-resource-form__checkbox"
                  />
                  <HelpBox helpText="Specifies if the Identity Resource is enabled" />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="identity-resource-form__label"
                  >
                    Show In Discovery Document
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
                  />
                  <HelpBox helpText="Specifies whether this scope is shown in the discovery document." />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="emphasize"
                    className="identity-resource-form__label"
                  >
                    Emphasize
                  </label>
                  <input
                    ref={register}
                    id="emphasize"
                    name="emphasize"
                    defaultChecked={props.identityResource.emphasize}
                    type="checkbox"
                    className="identity-resource-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes." />
                </div>

                <div className="identity-resource-form__container__checkbox__field">
                  <label
                    htmlFor="required"
                    className="identity-resource-form__label"
                  >
                    Required
                  </label>
                  <input
                    ref={register}
                    id="required"
                    name="required"
                    defaultChecked={props.identityResource.required}
                    type="checkbox"
                    className="identity-resource-form__checkbox"
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
                      defaultChecked={
                        props.identityResource.grantToLegalGuardians
                      }
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
                      defaultChecked={
                        props.identityResource.grantToProcuringHolders
                      }
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
                        props.identityResource.allowExplicitDelegationGrant
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
                      defaultChecked={
                        props.identityResource.automaticDelegationGrant
                      }
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
                      defaultChecked={
                        props.identityResource.alsoForDelegatedUser
                      }
                      className="api-scope-form__checkbox"
                      title="Should this scope be kept around for the delegated user. Mostly valid for system scopes. When authenticated as a delegating identity, all non-required scopes are removed from the top-level scope array, indicating that the access token can mainly be used to get resources for the delegating identity"
                    />
                    <HelpBox helpText="Should this scope be kept around for the delegated user. Mostly valid for system scopes. When authenticated as a delegating identity, all non-required scopes are removed from the top-level scope array, indicating that the access token can mainly be used to get resources for the delegating identity" />
                  </div>
                </section>

                <div className="identity-resource-form__buttons__container">
                  <div className="identity-resource-form__button__container">
                    <button
                      type="button"
                      className="identity-resource-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="identity-resource-form__button__container">
                    <input
                      type="submit"
                      className="identity-resource-form__button__save"
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

export default IdentityResourceCreateForm
