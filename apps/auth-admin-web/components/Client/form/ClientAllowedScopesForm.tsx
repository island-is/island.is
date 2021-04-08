import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import HelpBox from '../../common/HelpBox'
import { ClientAllowedScopeDTO } from '../../../entities/dtos/client-allowed-scope.dto'
import NoActiveConnections from '../../common/NoActiveConnections'
import { ClientService } from '../../../services/ClientService'
import ConfirmModal from '../../common/ConfirmModal'
import { ApiScope } from './../../../entities/models/api-scope.model'
import ValidationUtils from './../../../utils/validation.utils'
import TranslationUtils from './../../../utils/translation.utils'
import { FormPage } from './../../../entities/common/Translation'
interface Props {
  clientId: string
  scopes?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientAllowedScopesForm: React.FC<Props> = (props: Props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<ClientAllowedScopeDTO>()
  const { isSubmitting } = formState
  const [scopes, setScopes] = useState<ApiScope[]>([])
  const [selectedScope, setSelectedScope] = useState<ApiScope>(new ApiScope())
  const [scopeForDelete, setScopeForDelete] = useState<string>('')
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
  const [translation, setTranslation] = useState<FormPage>(
    TranslationUtils.getFormPage('ClientAllowedScopesForm'),
  )

  const add = async (data: ClientAllowedScopeDTO) => {
    const allowedScope = new ClientAllowedScopeDTO()
    allowedScope.clientId = props.clientId
    allowedScope.scopeName = data.scopeName

    const response = await ClientService.addAllowedScope(allowedScope)
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }
  }

  useEffect(() => {
    getAvailableScopes()
  }, [])

  const getAvailableScopes = async () => {
    const response = await ClientService.findAvailabeScopes()
    if (response) {
      setScopes(response)
    }
  }

  const setSelectedItem = (scopeName: string) => {
    const selected = scopes.find((e) => e.name === scopeName)
    if (selected) {
      setSelectedScope(selected)
    }
  }

  const remove = async () => {
    const response = await ClientService.removeAllowedScope(
      props.clientId,
      scopeForDelete,
    )
    if (response) {
      if (props.handleChanges) {
        props.handleChanges()
      }
    }

    closeConfirmModal()
  }

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false)
  }

  const confirmRemove = async (scope: string) => {
    setScopeForDelete(scope)
    setConfirmModalIsOpen(true)
  }

  const setHeaderElement = () => {
    return (
      <p>
        {translation.removeConfirmation}: <span>{scopeForDelete}</span>
      </p>
    )
  }

  return (
    <div className="client-allowed-scopes">
      <div className="client-allowed-scopes__wrapper">
        <div className="client-allowed-scopes__container">
          <h1>{translation.title}</h1>
          <div className="client-allowed-scopes__container__form">
            <div className="client-allowed-scopes__help">
              {translation.help}
            </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-allowed-scopes__container__fields">
                <div className="client-allowed-scopes__container__field">
                  <label
                    className="client-allowed-scopes__label"
                    htmlFor="scopeName"
                  >
                    {translation.fields['scopeName'].label}
                  </label>
                  <select
                    id="scopeName"
                    className="client-allowed-scopes__select"
                    name="scopeName"
                    ref={register({
                      required: true,
                      validate: ValidationUtils.validateScope,
                    })}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    {scopes.map((scope: ApiScope) => {
                      return <option value={scope.name}>{scope.name}</option>
                    })}
                  </select>
                  <HelpBox
                    helpText={translation.fields['scopeName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="scopeName"
                    message={translation.fields['scopeName'].errorMessage}
                  />
                  <input
                    type="submit"
                    className="client-allowed-scopes__button__add"
                    disabled={isSubmitting}
                    value={translation.addButton}
                  />
                </div>
                <div
                  className={`client-allowed-scopes__selected__item ${
                    selectedScope?.name ? 'show' : 'hidden'
                  }`}
                >
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      Scope Name
                    </div>
                    <div className="selected-item-property-value">
                      {selectedScope?.name}
                    </div>
                  </div>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      Display name
                    </div>
                    <div className="selected-item-property-value">
                      {selectedScope?.displayName}
                    </div>
                  </div>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      Description
                    </div>
                    <div className="selected-item-property-value">
                      {selectedScope?.description}
                    </div>
                  </div>
                </div>
              </div>

              <NoActiveConnections
                title={translation.noActiveConnections?.title}
                show={!props.scopes || props.scopes.length === 0}
                helpText={translation.noActiveConnections?.helpText}
              ></NoActiveConnections>

              <div
                className={`client-allowed-scopes__container__list ${
                  props.scopes && props.scopes.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>Active scopes</h3>
                {props.scopes?.map((scope: string) => {
                  return (
                    <div
                      className="client-allowed-scopes__container__list__item"
                      key={scope}
                    >
                      <div className="list-value">{scope}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => confirmRemove(scope)}
                          className="client-allowed-scopes__container__list__button__remove"
                          title={translation.removeButton}
                        >
                          <i className="icon__delete"></i>
                          <span>{translation.removeConfirmation}</span>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="client-allowed-scopes__buttons__container">
                <div className="client-allowed-scopes__button__container">
                  <button
                    type="button"
                    className="client-allowed-scopes__button__cancel"
                    onClick={props.handleBack}
                  >
                    {translation.cancelButton}
                  </button>
                </div>
                <div className="client-allowed-scopes__button__container">
                  <button
                    type="button"
                    className="client-allowed-scopes__button__save"
                    onClick={props.handleNext}
                  >
                    {translation.saveButton}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ConfirmModal
        modalIsOpen={confirmModalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeConfirmModal}
        confirmation={remove}
        confirmationText="Delete"
      ></ConfirmModal>
    </div>
  )
}
export default ClientAllowedScopesForm
