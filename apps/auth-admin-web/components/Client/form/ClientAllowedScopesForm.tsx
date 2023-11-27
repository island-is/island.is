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
import LocalizationUtils from '../../../utils/localization.utils'
import { FormControl } from '../../../entities/common/Localization'
interface Props {
  clientId: string
  scopes?: string[]
  handleNext?: () => void
  handleBack?: () => void
  handleChanges?: () => void
}

const ClientAllowedScopesForm: React.FC<React.PropsWithChildren<Props>> = (
  props: Props,
) => {
  const { register, handleSubmit, formState } = useForm<ClientAllowedScopeDTO>()
  const { isSubmitting, errors } = formState
  const [scopes, setScopes] = useState<ApiScope[]>([])
  const [selectedScope, setSelectedScope] = useState<ApiScope>(new ApiScope())
  const [scopeForDelete, setScopeForDelete] = useState<string>('')
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false)
  const [localization] = useState<FormControl>(
    LocalizationUtils.getFormControl('ClientAllowedScopesForm'),
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
        {localization.removeConfirmation}: <span>{scopeForDelete}</span>
      </p>
    )
  }

  return (
    <div className="client-allowed-scopes">
      <div className="client-allowed-scopes__wrapper">
        <div className="client-allowed-scopes__container">
          <h1>{localization.title}</h1>
          <div className="client-allowed-scopes__container__form">
            <div className="client-allowed-scopes__help">
              {localization.help}
            </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-allowed-scopes__container__fields">
                <div className="client-allowed-scopes__container__field">
                  <label
                    className="client-allowed-scopes__label"
                    htmlFor="scopeName"
                  >
                    {localization.fields['scopeName'].label}
                  </label>
                  <select
                    id="scopeName"
                    className="client-allowed-scopes__select"
                    {...register('scopeName', {
                      required: true,
                      onChange: (e) => setSelectedItem(e.target.value),
                    })}
                  >
                    {scopes.map((scope: ApiScope) => {
                      return (
                        <option value={scope.name} key={scope.name}>
                          {scope.name}
                        </option>
                      )
                    })}
                  </select>
                  <HelpBox
                    helpText={localization.fields['scopeName'].helpText}
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="scopeName"
                    message={localization.fields['scopeName'].errorMessage}
                  />
                  <input
                    type="submit"
                    className="client-allowed-scopes__button__add"
                    disabled={isSubmitting}
                    title={localization.buttons['add'].helpText}
                    value={localization.buttons['add'].text}
                  />
                </div>
                <div
                  className={`client-allowed-scopes__selected__item ${
                    selectedScope?.name ? 'show' : 'hidden'
                  }`}
                >
                  <h3>{localization.sections['selectedItem'].title}</h3>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      {
                        localization.sections['selectedItem'].properties['name']
                          .name
                      }
                    </div>
                    <div className="selected-item-property-value">
                      {selectedScope?.name}
                    </div>
                  </div>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      {
                        localization.sections['selectedItem'].properties[
                          'displayName'
                        ].name
                      }
                    </div>
                    <div className="selected-item-property-value">
                      {selectedScope?.displayName}
                    </div>
                  </div>
                  <div className="selected-item-property">
                    <div className="selected-item-property-name">
                      {
                        localization.sections['selectedItem'].properties[
                          'description'
                        ].name
                      }
                    </div>
                    <div className="selected-item-property-value">
                      {selectedScope?.description}
                    </div>
                  </div>
                </div>
              </div>

              <NoActiveConnections
                title={localization.noActiveConnections?.title}
                show={!props.scopes || props.scopes.length === 0}
                helpText={localization.noActiveConnections?.helpText}
              ></NoActiveConnections>

              <div
                className={`client-allowed-scopes__container__list ${
                  props.scopes && props.scopes.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>{localization.sections['active'].title}</h3>
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
                          title={localization.buttons['remove'].helpText}
                        >
                          <i className="icon__delete"></i>
                          <span>{localization.buttons['remove'].text}</span>
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
                    title={localization.buttons['cancel'].helpText}
                  >
                    {localization.buttons['cancel'].text}
                  </button>
                </div>
                <div className="client-allowed-scopes__button__container">
                  <button
                    type="button"
                    className="client-allowed-scopes__button__save"
                    onClick={props.handleNext}
                    title={localization.buttons['save'].helpText}
                  >
                    {localization.buttons['save'].text}
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
        confirmationText={localization.buttons['remove'].text}
      ></ConfirmModal>
    </div>
  )
}
export default ClientAllowedScopesForm
