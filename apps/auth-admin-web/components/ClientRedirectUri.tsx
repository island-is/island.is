import React, { useState, useEffect } from 'react';
import { ClientRedirectUriDTO } from '../models/dtos/client-redirect-uri.dto';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import { AddRedirectUri } from '../services/client.service';
import axios from 'axios';
import APIResponse from '../models/APIResponse';

interface Props {
  redirectObject: ClientRedirectUriDTO;
  uris: [],
  handleNext?: () => void;
  handleBack?: () => void;
}

const ClientRedirectUri: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientRedirectUriDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState(null);
  const [uris, setUris] = useState<string[]>([]);
  const [urisSet, setUrisSet] = useState<boolean>(false);

    /** Setting the uris when updating an existing client */
  useEffect(() => {
      if (!urisSet){
        if (props.uris && uris.length > 0)
        {
            for(let i = 0; i < uris.length; i++){
                uris.push(props.uris[i]);
            }
            setUris(uris);
            setUrisSet(true);
        }
      }
      
  });

  const add = async (data) => {
    const clientRedirect = new ClientRedirectUriDTO();
    clientRedirect.clientId = props.redirectObject.clientId;
    clientRedirect.redirectUri = data.redirectUri;
    let success = false;

    await axios
      .post(`/api/redirect-uri`, clientRedirect)
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
        console.log("setting uris: ", uris);
        setUris([...uris]);
      }
  };

  const remove = async (uri) => {
    let success = false;
    await axios
      .delete(`/api/redirect-uri/${props.redirectObject.clientId}/${uri}`)
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
        console.log("setting uris: ", uris);
        setUris([...uris]);
      }
  };

  return (
    <div className="client-redirect">
      <StatusBar status={response}></StatusBar>
      <div className="client-redirect__wrapper">
        <div className="client-redirect__container">
          <h1>Enter a callback URL</h1>
          <div className="client-redirect__help">
            Tokens will be sent to this endpoint
          </div>

          <div className="client-redirect__container__form">
            <form onSubmit={handleSubmit(add)}>
              <div className="client-redirect__container__fields">
                <div className="client-redirect__container__field">
                  <label className="client-redirect__label">Callback URL</label>
                  <input
                    type="text"
                    name="redirectUri"
                    ref={register({ required: true })}
                    defaultValue={props.redirectObject.redirectUri}
                    className="client-redirect__input"
                    placeholder="https://localhost:4200/signin-oidc"
                    title="Full path of the redirect URL. These protocols rely upon TLS in production"
                  />
                  <HelpBox helpText="Full path of the redirect URL. These protocols rely upon TLS in production" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="client.nationalId"
                    message="Path is required"
                  />
                  <input
                    type="submit"
                    className="client-redirect__button__save"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
              </div>

              <div className="client-redirect__container__list">
                {uris.map((uri: string) => {
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
                        >
                          Remove
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
                  >
                    Back
                  </button>
                </div>
                <div className="client-redirect__button__container">
                  <button
                    type="button"
                    className="client-redirect__button__save"
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
export default ClientRedirectUri;
