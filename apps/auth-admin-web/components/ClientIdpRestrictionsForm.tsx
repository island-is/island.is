import React, { useState } from 'react';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/common/APIResponse';

interface Props {
  clientId: string;
  restrictions?: string[]; // What is currently valid for updating existing Clients
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientIdpRestrictionsForm: React.FC<Props> = (props: Props) => {
  const [response, setResponse] = useState(null);

  const add = async (name: string) => {
    const createObj = {
      name: name,
      clientId: props.clientId,
    };
    await axios
      .post(`/api/idp-restriction`, createObj)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (props.handleChanges){
          props.handleChanges();
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

  const remove = async (name: string) => {
    await axios
      .delete(`/api/idp-restriction/${props.clientId}/${name}`)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
        if (props.handleChanges){
          props.handleChanges();
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

  const setSim = (sim: boolean) => {
    if (sim) {
      add('audkenni_sim');
    } else {
      remove('audkenni_sim');
    }
  };

  const setCard = (card: boolean) => {
    if (card) {
      add('audkenni_card');
    } else {
      remove('audkenni_card');
    }
  };

  return (
    <div className="client-idp-restriction">
      <StatusBar status={response}></StatusBar>
      <div className="client-idp-restriction__wrapper">
        <div className="client-idp-restriction__container">
          <h1>Select authentication types</h1>

          <div className="client-idp-restriction__container__form">
            <div className="client-idp-restriction__help">
              Select the types of authentication that are allowed for this
              Client
            </div>
            <div className="client-idp-restriction__container__fields">
              <div className="client-idp-restriction__container__checkbox__field">
                <label className="client-idp-restriction__label">
                  Sim card
                </label>
                <input
                  type="checkbox"
                  name="sim"
                  className="client__checkbox"
                  defaultChecked={props.restrictions?.includes('audkenni_sim')}
                  onChange={(e) => setSim(e.target.checked)}
                  title="Allows users to login with sim cards"
                />
                <HelpBox helpText="Allows users to login with sim cards" />
              </div>

              <div className="client-idp-restriction__container__checkbox__field">
                <label className="client-idp-restriction__label">
                  Identity card
                </label>
                <input
                  type="checkbox"
                  name="card"
                  className="client__checkbox"
                  defaultChecked={props.restrictions?.includes('audkenni_card')}
                  onChange={(e) => setCard(e.target.checked)}
                  title="Allows users to login with identity cards"
                />
                <HelpBox helpText="Allows users to login with identity cards" />
              </div>
            </div>

            <div className="client-idp-restriction__buttons__container">
              <div className="client-idp-restriction__button__container">
                <button
                  type="button"
                  className="client-idp-restriction__button__cancel"
                  onClick={props.handleBack}
                >
                  Back
                </button>
              </div>
              <div className="client-idp-restriction__button__container">
                <button
                  type="button"
                  className="client-idp-restriction__button__save"
                  value="Next"
                  onClick={props.handleNext}
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
export default ClientIdpRestrictionsForm;
