import React, { useState, useEffect } from 'react';
import { ClientRedirectUriDTO } from '../models/dtos/client-redirect-uri.dto';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/utils/APIResponse';

interface Props {
  clientId: string;
  defaultUrl?: string;
  uris?: string[];
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientRedirectUriForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientRedirectUriDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState(null);

  const add = async (data) => {
    const clientRedirect = new ClientRedirectUriDTO();
    clientRedirect.clientId = props.clientId;
    clientRedirect.redirectUri = data.redirectUri;

    await axios
      .post(`/api/redirect-uri`, clientRedirect)
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

  const remove = async (uri) => {
    await axios
      .delete(`/api/redirect-uri/${props.clientId}/${uri}`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (res.statusCode === 200) {
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
    <div className="client-redirect">
      <StatusBar status={response}></StatusBar>
      <div className="client-redirect__wrapper">
        <div className="client-redirect__container">
          <h1>Enter a callback URL</h1>
        

          <div className="client-redirect__container__form">
          <div className="client-redirect__help">
            Tokens will be sent to this endpoint
          </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-redirect__container__fields">
                <div className="client-redirect__container__field">
                  <label className="client-redirect__label">Callback URL</label>
                  <input
                    type="text"
                    name="redirectUri"
                    ref={register({ required: true })}
                    defaultValue={props.defaultUrl ?? ''}
                    className="client-redirect__input"
                    placeholder="https://localhost:4200/signin-oidc"
                    title="Full path of the redirect URL. These protocols rely upon TLS in production"
                  />
                  <HelpBox helpText="Full path of the redirect URL. These protocols rely upon TLS in production" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="redirectUri"
                    message="Path is required"
                  />
                  <input
                    type="submit"
                    className="client-redirect__button__add"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
              </div>
              </form>
             
              <div className={`client-redirect__container__list ${
                    props.uris && props.uris.length > 0  ? 'show' : 'hidden'
                  }`}>
                    <h3>Active callback URLs</h3>
                {props.uris?.map((uri: string) => {
                  return (
                    <div
                      className="client-redirect__container__list__item"
                      key={uri}
                    >
                      <div className="list-value">{uri}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => remove(uri)}
                          className="client-redirect__container__list__button__remove"
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

              <div className="client-redirect__buttons__container">
                <div className="client-redirect__button__container">
                  <button
                    type="button"
                    className="client-redirect__button__cancel"
                    title="Back"
                    onClick={props.handleBack}
                  >
                    Back
                  </button>
                </div>
                <div className="client-redirect__button__container">
                  <button
                    type="button"
                    className="client-redirect__button__save"
                    onClick={props.handleNext}
                    title="Next"
                  >
                    Next
                  </button>
                </div>
              </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};
export default ClientRedirectUriForm;
