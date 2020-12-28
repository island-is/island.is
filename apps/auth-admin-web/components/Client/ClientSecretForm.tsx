import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from '../Common/HelpBox';
import { ClientSecretDTO } from '../../entities/dtos/client-secret.dto';
import { ClientSecret } from '../../entities/models/client-secret.model';
import NoActiveConnections from '../Common/NoActiveConnections';
import { ClientService } from './../../services/ClientService';
import ConfirmModal from './../common/ConfirmModal';
import InfoModal from '../Common/InfoModal';

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
  const defaultSecretLength = 25;
  const [defaultSecret, setDefaultSecret] = useState<string>('');
  const [confirmModalIsOpen, setConfirmModalIsOpen] = useState(false);
  const [infoModalIsOpen, setInfoModalIsOpen] = useState(false);
  const [secretValue, setSecretValue] = useState<string>('');


  const [secretToRemove, setSecretToRemove] = useState<ClientSecret>(
    new ClientSecret()
  );


  const makeDefaultSecret = (length: number) => {
    let result = '';
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  useEffect(() => {
    setDefaultSecret(makeDefaultSecret(defaultSecretLength));
  }, []);

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

    const response = await ClientService.addClientSecret(secretObj);
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
      copyToClipboard(data.value);
      setSecretValue(data.value);
      setInfoModalIsOpen(true);

      document.getElementById('secretForm').reset();
      setDefaultSecret(makeDefaultSecret(defaultSecretLength));
    }
  };

  const closeInfoModal = () => {
    setInfoModalIsOpen(false);
  }
  
  const remove = async () => {
    const secretDTO = new ClientSecretDTO();
    secretDTO.clientId = secretToRemove.clientId;
    secretDTO.value = secretToRemove.value;
    secretDTO.type = secretToRemove.type;
    secretDTO.description = secretToRemove.description;

    const response = await ClientService.removeClientSecret(secretDTO);
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
    }

    closeConfirmModal();
  };

  const confirmRemove = async (secret: ClientSecret) => {
    setSecretToRemove(secret);
    setConfirmModalIsOpen(true);
  };

  const closeConfirmModal = () => {
    setConfirmModalIsOpen(false);
  }

  const setHeaderElement = () => {
    return (
      <p>
        Are you sure want to delete this secret:{' '}
        <span>{secretToRemove.type}</span> -{' '}
        <span>{secretToRemove.description}</span>
      </p>
    );
  };

  return (
    <div>
      <div className="client-secret">
        <div className="client-secret__wrapper">
          <div className="client-secret__container">
            <h1>Client Secrets</h1>
            <div className="client-secret__container__form">
              <div className="client-secret__help">
                List of client secrets - credentials to access the token
                endpoint.
              </div>
              <form id="secretForm" onSubmit={handleSubmit(add)}>
                <div className="client-secret__container__fields">
                  <div className="client-secret__container__field">
                    <label className="client-secret__label">
                      Client Secret
                    </label>
                    <input
                      id="secretValue"
                      type="text"
                      name="value"
                      ref={register({ required: true })}
                      defaultValue={defaultSecret}
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
                    <label
                      className="client-secret__label"
                      htmlFor="description"
                    >
                      Description
                    </label>
                    <input
                      id="description"
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

                <NoActiveConnections
                  title="No secrets are defined"
                  show={!props.secrets || props.secrets.length === 0}
                  helpText="Add a secret and push the Add button. A random string has been generated for you that you can use if you decide to."
                ></NoActiveConnections>

                <div
                  className={`client-secret__container__list ${
                    props.secrets && props.secrets.length > 0
                      ? 'show'
                      : 'hidden'
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
                        <div className="list-value">
                          {new Date(secret.created).toDateString()}
                        </div>
                        <div className="list-remove">
                          <button
                            type="button"
                            onClick={() => confirmRemove(secret)}
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
      <ConfirmModal
        modalIsOpen={confirmModalIsOpen}
        headerElement={setHeaderElement()}
        closeModal={closeConfirmModal}
        confirmation={remove}
        confirmationText="Delete"
      ></ConfirmModal>
      <InfoModal 
        modalIsOpen={infoModalIsOpen}
        headerText="Your secret has been copied to your clipboard. Don't lose it, you won't be able to see it again:"
        closeModal={closeInfoModal}
        handleButtonClicked={closeInfoModal}
        infoText={secretValue}
        buttonText="Ok"></InfoModal>
    </div>
  );
};
export default ClientSecretForm;
