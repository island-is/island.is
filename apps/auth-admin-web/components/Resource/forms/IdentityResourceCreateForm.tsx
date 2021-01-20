import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ResourcesService } from '../../../services/ResourcesService'
import IdentityResourceDTO from '../../../entities/dtos/identity-resource.dto'

interface Props {
  handleSave?: (object: IdentityResourceDTO) => void
  handleCancel?: () => void
  identityResource: IdentityResourceDTO
}

const IdentityResourceCreateForm: React.FC<Props> = (props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    IdentityResourceDTO
  >()
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
                    ref={register({ required: true })}
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
                    message="Name is required"
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
                    ref={register({ required: true })}
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
                    message="Display name is required"
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
                    ref={register({ required: false })}
                    id="description"
                    name="description"
                    type="text"
                    defaultValue={props.identityResource.description}
                    className="identity-resource-form__input"
                  />
                  <HelpBox helpText="The description value will be used e.g. on the consent screen." />
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
