import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/common/APIResponse';
import { ClientAllowedScopeDTO } from '../models/dtos/client-allowed-scope.dto';

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

  const add = async (data: any) => {
    const allowedScope = new ClientAllowedScopeDTO();
    allowedScope.clientId = props.clientId;
    allowedScope.scopeName = data.scopeName;

    await axios
      .post(`/api/client-allowed-scope`, allowedScope)
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

  const remove = async (scope: string) => {
    await axios
      .delete(
        `/api/client-allowed-scope/${props.clientId}/${encodeURIComponent(
          scope
        )}`
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
              Allowed scopes for client
            </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-allowed-scopes__container__fields">
                <div className="client-allowed-scopes__container__field">
                  <label className="client-allowed-scopes__label">
                    Scope Name
                  </label>
                  <input
                    type="text"
                    name="scopeName"
                    ref={register({ required: true })}
                    defaultValue={''}
                    className="client-allowed-scopes__input"
                    placeholder="@example/scope"
                    title="Allowed scopen"
                  />
                  <HelpBox helpText="Lorem Ipsum" />
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
              </div>

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
