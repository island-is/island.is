import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from '../../Common/HelpBox';
import { ClientAllowedScopeDTO } from '../../../entities/dtos/client-allowed-scope.dto';
import NoActiveConnections from '../../Common/NoActiveConnections';
import { ClientService } from '../../../services/ClientService';
import ConfirmModal from '../../Common/ConfirmModal';
import { ApiScope } from './../../../entities/models/api-scope.model';

interface Props {
  clientId: string;
  scopes?: string[];
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientAllowedScopes: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientAllowedScopeDTO
  >();
  const { isSubmitting } = formState;
  const [scopes, setScopes] = useState<ApiScope[]>([]);
  const [selectedScope, setSelectedScope] = useState<ApiScope>(new ApiScope());
  const [scopeForDelete, setScopeForDelete] = useState<string>('');
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  const add = async (data: ClientAllowedScopeDTO) => {
    const allowedScope = new ClientAllowedScopeDTO();
    allowedScope.clientId = props.clientId;
    allowedScope.scopeName = data.scopeName;

    const response = await ClientService.addAllowedScope(allowedScope);
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }
  };

  useEffect(() => {
    getAvailableScopes();
  }, []);

  const getAvailableScopes = async () => {
    const response = await ClientService.FindAvailabeScopes();
    if (response) {
      setScopes(response);
    }
  };

  const setSelectedItem = (scopeName: string) => {
    const selected = scopes.find((e) => e.name === scopeName);
    if (selected) {
      setSelectedScope(selected);
    }
  };

  const remove = async () => {
    const response = await ClientService.removeAllowedScope(
      props.clientId,
      scopeForDelete
    );
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }

    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
  };

  const confirmRemove = async (scope: string) => {
    setScopeForDelete(scope);
    setConfirmModalIsOpen(true);
  };

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this scope: <span>{scopeForDelete}</span>
      </p>
    );
  };

  return (
    <div className="client-allowed-scopes">
      <div className="client-allowed-scopes__wrapper">
        <div className="client-allowed-scopes__container">
          <h1>Allowed scopes</h1>
          <div className="client-allowed-scopes__container__form">
            <div className="client-allowed-scopes__help">
              By default a client has no access to any resources. Specify the
              allowed resources by adding the corresponding scopes names
            </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-allowed-scopes__container__fields">
                <div className="client-allowed-scopes__container__field">
                  <label
                    className="client-allowed-scopes__label"
                    htmlFor="scopeName"
                  >
                    Scope Name
                  </label>
                  <select
                    id="scopeName"
                    className="client-allowed-scopes__select"
                    name="scopeName"
                    ref={register({ required: true })}
                    onChange={(e) => setSelectedItem(e.target.value)}
                  >
                    {scopes.map((scope: ApiScope) => {
                      return <option value={scope.name}>{scope.name}</option>;
                    })}
                  </select>
                  <HelpBox helpText="Select an allowed scope" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="scopeName"
                    message="Scope Name is required"
                  />
                  <input
                    type="submit"
                    className="client-allowed-scopes__button__add"
                    disabled={isSubmitting}
                    value="Add"
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
                title="No active scopes"
                show={!props.scopes || props.scopes.length === 0}
                helpText="Select a scope and push the Add button to add a scope"
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
                          title="Remove"
                        >
                          <i className="icon__delete"></i>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="client-allowed-scopes__buttons__container">
                <div className="client-allowed-scopes__button__container">
                  <button
                    type="button"
                    className="client-allowed-scopes__button__cancel"
                    onClick={props.handleBack}
                  >
                    Back
                  </button>
                </div>
                <div className="client-allowed-scopes__button__container">
                  <button
                    type="button"
                    className="client-allowed-scopes__button__save"
                    onClick={props.handleNext}
                  >
                    Next
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
  );
};
export default ClientAllowedScopes;
