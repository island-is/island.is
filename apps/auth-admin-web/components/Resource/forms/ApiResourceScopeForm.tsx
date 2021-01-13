import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from './../../Common/HelpBox';
import NoActiveConnections from './../../Common/NoActiveConnections';
import { ClientService } from './../../../services/ClientService';
import { ApiResourceScopeDTO } from './../../../entities/dtos/api-resource-allowed-scope.dto';
import { ResourcesService } from './../../../services/ResourcesService';
import ConfirmModal from '../../Common/ConfirmModal';
import { ApiScope } from './../../../entities/models/api-scope.model';

interface Props {
  apiResourceName: string;
  scopes?: string[];
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ApiResourceScopeForm: React.FC<Props> = (props: Props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<ApiResourceScopeDTO>();
  const { isSubmitting } = formState;
  const [scopes, setScopes] = useState<ApiScope[]>([]);
  const [selectedScope, setSelectedScope] = useState<ApiScope>(new ApiScope());
  const [scopeForDelete, setScopeForDelete] = useState<string>('');
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);

  const add = async (data: ApiResourceScopeDTO) => {
    const allowedScope = new ApiResourceScopeDTO();
    allowedScope.apiResourceName = props.apiResourceName;
    allowedScope.scopeName = data.scopeName;

    const response = await ResourcesService.addApiResourceAllowedScope(
      allowedScope
    );
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
    if ( response ){
      setScopes(response);
    }
  };

  const setSelectedItem = (scopeName: string) => {
    const selected = scopes.find((e) => e.name === scopeName);
    if (selected){
      setSelectedScope(selected);
    }
  };

  const remove = async () => {
    const response = await ResourcesService.removeApiResourceAllowedScope(
      props.apiResourceName,
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
    <div className="api-resource-scope-form">
      <div className="api-resource-scope-form__wrapper">
        <div className="api-resource-scope-form__container">
          <h1>Allowed scopes</h1>
          <div className="api-resource-scope-form__container__form">
            <div className="api-resource-scope-form__help">
            An API must have at least one scope. Each scope can have different settings.
            </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="api-resource-scope-form__container__fields">
                <div className="api-resource-scope-form__container__field">
                  <label
                    className="api-resource-scope-form__label"
                    htmlFor="scopeName"
                  >
                    Scope Name
                  </label>
                  <select
                    id="scopeName"
                    className="api-resource-scope-form__select"
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
                    className="api-resource-scope-form__button__add"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
                <div
                  className={`api-resource-scope-form__selected__item ${
                    selectedScope?.name ? 'show' : 'hidden'
                  }`}
                  key={selectedScope?.name}
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
                className={`api-resource-scope-form__container__list ${
                  props.scopes && props.scopes.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>Active scopes</h3>
                {props.scopes?.map((scope: string) => {
                  return (
                    <div
                      className="api-resource-scope-form__container__list__item"
                      key={scope}
                    >
                      <div className="list-value">{scope}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => confirmRemove(scope)}
                          className="api-resource-scope-form__container__list__button__remove"
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

              <div className="api-resource-scope-form__buttons__container">
                <div className="api-resource-scope-form__button__container">
                  <button
                    type="button"
                    className="api-resource-scope-form__button__cancel"
                    onClick={props.handleBack}
                  >
                    Back
                  </button>
                </div>
                <div className="api-resource-scope-form__button__container">
                  <button
                    type="button"
                    className="api-resource-scope-form__button__save"
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
export default ApiResourceScopeForm;
