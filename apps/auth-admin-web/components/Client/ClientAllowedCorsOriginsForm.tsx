import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import StatusBar from '../Layout/StatusBar';
import HelpBox from '../Common/HelpBox';
import APIResponse from '../../entities/common/APIResponse';
import { ClientAllowedCorsOriginDTO } from '../../entities/dtos/client-allowed-cors-origin.dto';
import api from '../../services/api';
import NoActiveConnections from '../Common/NoActiveConnections';
import { ClientService } from 'apps/auth-admin-web/services/ClientService';

interface Props {
  clientId: string;
  defaultOrigin?: string;
  origins?: string[];
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientAllowedCorsOriginsForm: React.FC<Props> = (props: Props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ClientAllowedCorsOriginDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [defaultOrigin, setDefaultOrigin] = useState(
    !props.origins || props.origins.length === 0 ? props.defaultOrigin : ''
  );

  const add = async (data: any) => {
    const allowedCorsOrigin = new ClientAllowedCorsOriginDTO();
    allowedCorsOrigin.clientId = props.clientId;
    allowedCorsOrigin.origin = data.origin;

    const response = await ClientService.addAllowedCorsOrigin(
      allowedCorsOrigin
    );
    if (response) {
      if (props.handleChanges) {
        props.handleChanges();
      }
      setDefaultOrigin('');
      document.getElementById('corsForm').reset();
    }
  };

  const remove = async (origin: string) => {
    if (
      window.confirm(
        `Are you sure you want to delete this cors origin: "${origin}"?`
      )
    ) {
      const response = await ClientService.removeAllowedCorsOrigin(
        props.clientId,
        origin
      );
      if (response) {
        if (props.handleChanges) {
          props.handleChanges();
        }
      }
    }
  };

  return (
    <div className="client-allowed-cors-origin">
      <StatusBar status={response}></StatusBar>
      <div className="client-allowed-cors-origin__wrapper">
        <div className="client-allowed-cors-origin__container">
          <h1>Enter allowed cors origins</h1>
          <div className="client-allowed-cors-origin__container__form">
            <div className="client-allowed-cors-origin__help">
              <p>Allowed cors origins</p>
            </div>
            <form id="corsForm" onSubmit={handleSubmit(add)}>
              <div className="client-allowed-cors-origin__container__fields">
                <div className="client-allowed-cors-origin__container__field">
                  <label className="client-allowed-cors-origin__label">
                    Allow cors origin
                  </label>
                  <input
                    type="text"
                    name="origin"
                    ref={register({ required: true })}
                    defaultValue={defaultOrigin}
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

              <NoActiveConnections
                title="No active cors origins"
                show={!props.origins || props.origins.length === 0}
                helpText="Define a cors origin and push the Add button to add a cors origin"
              ></NoActiveConnections>

              <div
                className={`client-allowed-cors-origin__container__list ${
                  props.origins && props.origins.length > 0 ? 'show' : 'hidden'
                }`}
              >
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
