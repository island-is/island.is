import React, { useState, useEffect } from 'react';
import { ClientPostLogoutRedirectUriDTO } from '../models/dtos/client-post-logout-redirect-uri.dto';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/utils/APIResponse';

interface Props {
  clientId: string;
  defaultUrl: string;
  uris: [],
  handleNext?: () => void;
  handleBack?: () => void;
}

const ClientPostLogoutRedirectUri: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
  ClientPostLogoutRedirectUriDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState(null);
  const [uris, setUris] = useState<string[]>([]);

  /** Setting the uris when updating an existing client */
  useEffect(() => {
    if (props.uris && uris.length > 0)
    {
        for(let i = 0; i < uris.length; i++){
            uris.push(props.uris[i]);
        }
        setUris(uris);
    }
     
  }, [props.uris]);

  const add = async (data) => {
    const clientRedirect = new ClientPostLogoutRedirectUriDTO();
    clientRedirect.clientId = props.clientId;
    clientRedirect.redirectUri = data.redirectUri;
    let success = false;

    await axios
      .post(`/api/client-post-logout-redirect-uri`, clientRedirect)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (response.status === 201) {
          success = true;
        }
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        } else {
          // TODO: Handle and show error
        }
      });

      if ( success ){
        uris.push(clientRedirect.redirectUri);
        setUris([...uris]);
      }
  };

  const remove = async (uri) => {
    let success = false;
    await axios
      .delete(`/api/client-post-logout-redirect-uri/${props.clientId}/${uri}`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (res.statusCode === 200){
           success = true;
        }
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        } else {
          // TODO: Handle and show error
        }
      });

      if ( success ){
        uris.splice(uris.indexOf(uri), 1);
        setUris([...uris]);
      }
  };

  return (
    <div className="client-post-logout">
      <StatusBar status={response}></StatusBar>
      <div className="client-post-logout__wrapper">
        <div className="client-post-logout__container">
          <h1>Enter a post logout redirect URL</h1>
          <div className="client-post-logout__container__form">
          <div className="client-post-logout__help">
            <p><strong>Optional</strong> (you can configure this at a later time)</p>
            <p>Users can be returned to this URL(s) after logging out</p>
          </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-post-logout__container__fields">
                <div className="client-post-logout__container__field">
                  <label className="client-post-logout__label">Logout URL</label>
                  <input
                    type="text"
                    name="redirectUri"
                    ref={register({ required: true })}
                    defaultValue={props.defaultUrl}
                    className="client-post-logout__input"
                    placeholder="https://localhost:4200"
                    title="Users can be returned to this URL after logging out. These protocols rely upon TLS in production"
                  />
                  <HelpBox helpText="Users can be returned to this URL after logging out. These protocols rely upon TLS in production" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="redirectUri"
                    message="Path is required"
                  />
                  <input
                    type="submit"
                    className="client-post-logout__button__add"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
              </div>

              <div className="client-post-logout__container__list">
                {uris.map((uri: string) => {
                  <h3>Active post logout URLs</h3>
                  return (
                    <div
                      className="client-post-logout__container__list__item"
                      key={uri}
                    >
                      <div className="list-value">{uri}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => remove(uri)}
                          className="client-post-logout__container__list__button__remove"
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

              <div className="client-post-logout__buttons__container">
                <div className="client-post-logout__button__container">
                  <button
                    type="button"
                    className="client-post-logout__button__cancel"
                  >
                    Back
                  </button>
                </div>
                <div className="client-post-logout__button__container">
                  <button
                    type="button"
                    className="client-post-logout__button__save"
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
export default ClientPostLogoutRedirectUri;
