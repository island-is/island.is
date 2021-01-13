import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import HelpBox from '../../common/HelpBox'
import { ErrorMessage } from '@hookform/error-message'
import { ApiScopesDTO } from '../../../entities/dtos/api-scopes-dto'
import { ResourcesService } from '../../../services/ResourcesService'

interface Props {
  handleSave?: (object: ApiScopesDTO) => void
  handleCancel?: () => void
  apiScope: ApiScopesDTO
}

const ApiScopeCreateForm: React.FC<Props> = (props) => {
  const { register, handleSubmit, errors, formState } = useForm<ApiScopesDTO>()
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
    const response = await ResourcesService.getApiScopeByName(name)
    if (response) {
      setAvailable(false)
    } else {
      setAvailable(true)
    }
  }

  const save = async (data: ApiScopesDTO) => {
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
                    ref={register({ required: true })}
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
                    message="Name is required"
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
                    ref={register({ required: true })}
                    id="displayName"
                    name="displayName"
                    type="text"
                    className="api-scope-form__input"
                    defaultValue={props.apiScope.displayName}
                  />
                  <HelpBox helpText="This value can be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message="Display name is required"
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
                    ref={register({ required: false })}
                    id="description"
                    name="description"
                    type="text"
                    defaultValue={props.apiScope.description}
                    className="api-scope-form__input"
                  />
                  <HelpBox helpText="This value can be used e.g. on the consent screen." />
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
