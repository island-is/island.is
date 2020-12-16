import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/common/APIResponse';
import { ClientSecretDTO } from '../models/dtos/client-secret.dto';

interface Props {
  clientId: string;
  secrets?: ClientSecretDTO[],
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientSecretForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
  ClientSecretDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState<APIResponse>(new APIResponse());

  const add = async (data: any) => {
    throw Error('Not Implemented');
    // const allowedScope = new ClientAllowedScopeDTO();
    // allowedScope.clientId = props.clientId;
    // allowedScope.scopeName = data.scopeName;

    // await axios
    //   .post(`/api/client-allowed-scope`, allowedScope)
    //   .then((response) => {
    //     const res = new APIResponse();
    //     res.statusCode = response.request.status;
    //     res.message = response.request.statusText;
    //     setResponse(res);
    //     if (response.status === 201) {
    //       if (props.handleChanges){
    //         props.handleChanges();
    //       }
    //     }
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       setResponse(error.response.data);
    //     } else {
    //       // TODO: Handle and show error
    //     }
    //   });
  };

  const remove = async (secret: string) => {
    throw Error('Not Implemented');
    // await axios
    //   .delete(`/api/client-allowed-scope/${props.clientId}/${scope}`)
    //   .then((response) => {
    //     const res = new APIResponse();
    //     res.statusCode = response.request.status;
    //     res.message = response.request.statusText;
    //     setResponse(res);
    //     if (res.statusCode === 200){
    //        if (props.handleChanges){
    //         props.handleChanges();
    //       }
    //     }
    //   })
    //   .catch(function (error) {
    //     if (error.response) {
    //       setResponse(error.response.data);
    //     } else {
    //       // TODO: Handle and show error
    //     }
    //   });
  };

  return (
    <div className="client-secret">
      <StatusBar status={response}></StatusBar>
      <div className="client-secret__wrapper">
        <div className="client-secret__container">
          <h1>Client Secrets</h1>
          <div className="client-secret__container__form">
          <div className="client-secret__help">
            Add client secret for client
            <p>If client is a SPA client. This is <strong>not</strong> neccesary.</p>
          </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-secret__container__fields">
                <div className="client-secret__container__field">
                  <label className="client-secret__label">Client Secret (Draft)</label>
                  <input
                    type="text"
                    name="value"
                    ref={register({ required: true })}
                    defaultValue={''}
                    className="client-secret__input"
                    placeholder="Some secret text"
                    title="Allowed scopen"
                  />
                  <HelpBox helpText="Lorem Ipsum" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="value"
                    message="Value is required"
                  />
                  <input
                    type="submit"
                    className="client-secret__button__add"
                    disabled={isSubmitting}
                    value="Add"
                  />
                </div>
                <div className="client-secret__container__field">
                  <label className="client-secret__label">Type</label>
                  <input
                    type="text"
                    name="type"
                    ref={register({ required: true })}
                    defaultValue={''}
                    className="client-secret__input"
                    placeholder="Type of secret"
                    title="Allowed scopen"
                  />
                  <HelpBox helpText="Lorem Ipsum" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="type"
                    message="Type is required"
                  />
                </div>
                <div className="client-secret__container__field">
                  <label className="client-secret__label">Description</label>
                  <input
                    type="text"
                    name="description"
                    ref={register({ required: true })}
                    defaultValue={''}
                    className="client-secret__input"
                    placeholder="Secret description"
                    title="Allowed scopen"
                  />
                  <HelpBox helpText="Lorem Ipsum" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message="Type is required"
                  />
                </div>
              </div>

              <div className={`client-secret__container__list ${
                    props.secrets && props.secrets.length > 0  ? 'show' : 'hidden'
                  }`}>
              <h3>Active secrets</h3>
                {props.secrets?.map((secret: ClientSecretDTO) => {
                  
                  return (
                    <div
                      className="client-secret__container__list__item"
                      key={secret.value}
                    >
                      <div className="list-name">{secret.description}</div>
                      <div className="list-value">{secret.value}</div>
                      <div className="list-value">{secret.type}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => remove(secret.value)}
                          className="client-secret__container__list__button__remove"
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

              <div className="client-secret__buttons__container">
                <div className="client-secret__button__container">
                  <button
                    type="button"
                    className="client-secret__button__cancel"
                  >
                    Back
                  </button>
                </div>
                <div className="client-secret__button__container">
                  <button
                    type="button"
                    className="client-secret__button__save"
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
export default ClientSecretForm;
