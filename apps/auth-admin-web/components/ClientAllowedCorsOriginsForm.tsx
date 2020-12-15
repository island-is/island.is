import React, { useState, useEffect } from 'react';
import { ClientPostLogoutRedirectUriDTO } from '../models/dtos/client-allowed-cors-origin-redirect-uri.dto';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/common/APIResponse';
import { ClientAllowedCorsOriginDTO } from '../models/dtos/client-allowed-cors-origin.dto';

interface Props {
  clientId: string;
  defaultOrigin?: string;
  origins?: string[],
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientAllowedCorsOriginsForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
  ClientPostLogoutRedirectUriDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState(null);

  const add = async (data) => {
    const clientRedirect = new ClientAllowedCorsOriginDTO();
    clientRedirect.clientId = props.clientId;
    clientRedirect.origin = data.origin;

    await axios
      .post(`/api/cors`, clientRedirect)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (response.status === 201) {
          if (props.handleChanges){
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

  const remove = async (origin: string) => {
    await axios
      .delete(`/api/cors/${props.clientId}/${origin}`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (res.statusCode === 200){
           if (props.handleChanges){
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
    <div className="client-allowed-cors-origin">
      <StatusBar status={response}></StatusBar>
      <div className="client-allowed-cors-origin__wrapper">
        <div className="client-allowed-cors-origin__container">
          <h1>Enter allowed cors origins</h1>
          <div className="client-allowed-cors-origin__container__form">
          <div className="client-allowed-cors-origin__help">
            <p><strong>Optional</strong> (you can configure this at a later time)</p>
            <p>Allowed cors origins</p>
          </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-allowed-cors-origin__container__fields">
                <div className="client-allowed-cors-origin__container__field">
                  <label className="client-allowed-cors-origin__label">Allow cors origin</label>
                  <input
                    type="text"
                    name="origin"
                    ref={register({ required: true })}
                    defaultValue={props.defaultOrigin}
                    className="client-allowed-cors-origin__input"
                    placeholder="https://localhost:4200"
                    title="Users can be returned to this URL after logging out. These protocols rely upon TLS in production"
                  />
                  <HelpBox helpText="Users can be returned to this URL after logging out. These protocols rely upon TLS in production" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="origin"
                    message="Path is required"
                  />
                  <input
                    type="submit"
                    className="client-allowed-cors-origin__button__add"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
              </div>

              <div className={`client-allowed-cors-origin__container__list ${
                    props.origins && props.origins.length > 0  ? 'show' : 'hidden'
                  }`}>
              <h3>Allowed cors origins</h3>
                {props.origins?.map((origin: string) => {
                  
                  return (
                    <div
                      className="client-allowed-cors-origin__container__list__item"
                      key={origin}
                    >
                      <div className="list-value">{origin}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => remove(origin)}
                          className="client-allowed-cors-origin__container__list__button__remove"
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

              <div className="client-allowed-cors-origin__buttons__container">
                <div className="client-allowed-cors-origin__button__container">
                  <button
                    type="button"
                    className="client-allowed-cors-origin__button__cancel"
                  >
                    Back
                  </button>
                </div>
                <div className="client-allowed-cors-origin__button__container">
                  <button
                    type="button"
                    className="client-allowed-cors-origin__button__save"
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
export default ClientAllowedCorsOriginsForm;
