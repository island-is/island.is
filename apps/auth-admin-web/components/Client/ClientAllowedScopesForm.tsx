import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from '../Layout/StatusBar';
import HelpBox from '../Common/HelpBox';
import APIResponse from '../../entities/common/APIResponse';
import { ClientAllowedScopeDTO } from '../../entities/dtos/client-allowed-scope.dto';
import api from '../../services/api';
import NoActiveConnections from '../Common/NoActiveConnections';

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
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [scopes, setScopes] = useState<any>([]);
  const [selectedScope, setSelectedScope] = useState<any>(null);

  const add = async (data: any) => {
    const allowedScope = new ClientAllowedScopeDTO();
    allowedScope.clientId = props.clientId;
    allowedScope.scopeName = data.scopeName;

    await api
      .post(`client-allowed-scope`, allowedScope)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (response.status === 201) {
          if (props.handleChanges) {
            props.handleChanges();
          }
        }
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        } else {
          // TODO: Handle and show error
        }
      });
  };

  useEffect(() => {
    getAvailableScopes();
  }, []);

  const getAvailableScopes = async () => {
    await api
      .get(`client-allowed-scope`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        setScopes(response.data);
        if (response.status === 201) {
          if (props.handleChanges) {
            props.handleChanges();
          }
        }
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        } else {
          // TODO: Handle and show error
        }
      });
  };

  const setSelectedItem = (scopeName: string) => {
    const selected = scopes.find((e) => e.name == scopeName);
    setSelectedScope(selected);
  };

  const remove = async (scope: string) => {
    await api
      .delete(
        `client-allowed-scope/${props.clientId}/${encodeURIComponent(scope)}`
      )
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (res.statusCode === 200) {
          if (props.handleChanges) {
            props.handleChanges();
          }
        }
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        } else {
          // TODO: Handle and show error
        }
      });
  };

  return (
    <div className="client-allowed-scopes">
      <StatusBar status={response}></StatusBar>
      <div className="client-allowed-scopes__wrapper">
        <div className="client-allowed-scopes__container">
          <h1>Allowed scopes</h1>
          <div className="client-allowed-scopes__container__form">
            <div className="client-allowed-scopes__help">
            By default a client has no access to any resources. Specify the allowed resources by adding the corresponding scopes names
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
                    {scopes.map((scope: any) => {
                      return (
                        <option value={scope.name}>
                          {scope.name}
                        </option>
                      );
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

              <NoActiveConnections title="No active scopes" show={!props.scopes || props.scopes.length === 0} helpText="Select a scope and push the Add button to add a scope">
              </NoActiveConnections>

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
                          onClick={() => remove(scope)}
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
    </div>
  );
};
export default ClientAllowedScopes;
