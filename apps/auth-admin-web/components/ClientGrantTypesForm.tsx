import React, { useEffect, useState } from 'react';
import StatusBar from './StatusBar';
import HelpBox from './HelpBox';
import axios from 'axios';
import APIResponse from '../models/common/APIResponse';
import { GrantType } from '../models/grant-type.model';
import { ClientGrantTypeDTO } from '../models/dtos/client-grant-type.dto';
import { ClientGrantType } from '../models/client-grant-type.model';

interface Props {
  clientId: string;
  grantTypes?: string[]; // What is currently valid for updating existing Clients
  handleNext?: () => void;
  handleBack?: () => void;
  handleChanges?: () => void;
}

const ClientGrantTypesForm: React.FC<Props> = (props: Props) => {
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [grantTypes, setGrantTypes] = useState<GrantType[]>([]);

  useEffect(() => {
      getGrantTypes();
  }, [])

  const getGrantTypes = async () => {
    // TODO: Fix in service. We don't need paging
    await axios
    .get(`/api/grants`)
    .then((response) => {
        console.log(response);
        setGrantTypes(response.data);
        /*
      const res = new APIResponse();
      res.statusCode = response.request.status;
      res.message = response.request.statusText;
      setResponse(res);*/
      
    })
    .catch(function (error) {
      if (error.response) {
        setResponse(error.response.data);
      } else {
        // TODO: Handle and show error
      }
    });
  }

  const add = async (grantType: string) => {
    const createObj: ClientGrantTypeDTO = {
        grantType: grantType,
      clientId: props.clientId,
    };

    await axios
      .post(`/api/client-grant-type`, createObj)
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

  const remove = async (grantType: string) => {
    await axios
      .delete(`/api/client-grant-type/${props.clientId}/${grantType}`)
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

  const setValue = (grantType:string, value: boolean) => {
    if (value) {
      add(grantType);
    } else {
      remove(grantType);
    }
  };

  return (
    <div className="client-grant-types">
      <StatusBar status={response}></StatusBar>
      <div className="client-grant-types__wrapper">
        <div className="client-grant-types__container">
          <h1>Select authentication types</h1>

          <div className="client-grant-types__container__form">
            <div className="client-grant-types__help">
              Select the types of authentication that are allowed for this
              Client
            </div>
            <div className="client-grant-types__container__fields">
            {grantTypes?.map((grantType: GrantType) => {
                return (
                    <div className="client-grant-types__container__checkbox__field" key={grantType.name}>
                    <label className="client-grant-types__label" title={grantType.description}>
                        {grantType.name}
                    </label>
                    <input
                      type="checkbox"
                      name={grantType.name}
                      className="client__checkbox"
                      defaultChecked={props.grantTypes?.includes(grantType.name)}
                      onChange={(e) => setValue(grantType.name, e.target.checked)}
                      title={`Set grant type ${grantType.name} as active og inactive`}
                    />
                    <HelpBox helpText={grantType.description} />
                  </div>
                );
              })}
            </div>

            <div className="client-grant-types__buttons__container">
              <div className="client-grant-types__button__container">
                <button
                  type="button"
                  className="client-grant-types__button__cancel"
                  onClick={props.handleBack}
                >
                  Back
                </button>
              </div>
              <div className="client-grant-types__button__container">
                <button
                  type="button"
                  className="client-grant-types__button__save"
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
export default ClientGrantTypesForm;
