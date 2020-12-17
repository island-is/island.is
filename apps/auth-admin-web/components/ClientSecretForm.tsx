import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/common/APIResponse';
import { ClientSecretDTO } from '../models/dtos/client-secret.dto';
import { ClientSecret } from '../models/client-secret.model';

interface Props {
  clientId: string;
  secrets?: ClientSecret[];
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

  const makeDefaultSecret = (length: number) => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const copyToClipboard = (val: string) => {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  };

  const add = async (data: any) => {
    const secretObj = new ClientSecretDTO();
    secretObj.clientId = props.clientId;
    secretObj.description = data.description;
    secretObj.type = data.type;
    secretObj.value = data.value;

    await axios
      .post(`/api/client-secret`, secretObj)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (response.status === 201) {
          if (props.handleChanges) {
            props.handleChanges();
            copyToClipboard(data.value);
            // TODO: We should use something else that alert
            alert(`Your secret has been copied to your clipboard.\r\nDon't lose it, you won't be able to see it again:\r\n${data.value}`);
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

  const remove = async (secret: ClientSecret) => {
    const secretDTO = new ClientSecretDTO();
    secretDTO.clientId = secret.clientId;
    secretDTO.value = secret.value;
    secretDTO.type = secret.type;
    secretDTO.description = secret.description;

    await axios
      .delete(`/api/client-secret`, { data: secretDTO })
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (response.status === 200) {
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
    <div className="client-secret">
      <StatusBar status={response}></StatusBar>
      <div className="client-secret__wrapper">
        <div className="client-secret__container">
          <h1>Client Secrets</h1>
          <div className="client-secret__container__form">
            <div className="client-secret__help">
              Add client secret for client
            </div>
            <form onSubmit={handleSubmit(add)}>
              <div className="client-secret__container__fields">
                <div className="client-secret__container__field">
                  <label className="client-secret__label">Client Secret</label>
                  <input
                    id="secretValue"
                    type="text"
                    name="value"
                    ref={register({ required: true })}
                    defaultValue={makeDefaultSecret(25)}
                    className="client-secret__input"
                    placeholder="Some secret text"
                    title="The secret value"
                  />
                  <HelpBox helpText="Your secret value should be a rather complicated string" />
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
                    defaultValue={'SharedSecret'}
                    className="client-secret__input"
                    placeholder="Type of secret"
                    title="Allowed scopen"
                    readOnly
                  />
                  <HelpBox helpText="SharedSecret is the only type supported" />
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
                    title="Description of the secret"
                  />
                  <HelpBox helpText="Description of the secret" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="description"
                    message="Description is required"
                  />
                </div>
              </div>

              <div
                className={`client-secret__container__list ${
                  props.secrets && props.secrets.length > 0 ? 'show' : 'hidden'
                }`}
              >
                <h3>Active secrets</h3>
                {props.secrets?.map((secret: ClientSecret) => {
                  return (
                    <div
                      className="client-secret__container__list__item"
                      key={secret.created.toString()}
                    >
                      <div className="list-value">{secret.type}</div>
                      <div className="list-name">{secret.description}</div>
                      <div className="list-value">{new Date(secret.created).toDateString()}</div>
                      <div className="list-remove">
                        <button
                          type="button"
                          onClick={() => remove(secret)}
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
