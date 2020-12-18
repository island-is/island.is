import React, { useState } from 'react';
import IdentityResourcesDTO from '../models/dtos/identity-resources.dto';
import StatusBar from './StatusBar';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from './HelpBox';
import APIResponse from '../models/common/APIResponse';
import api from '../services/api'

type Props = {
  resource: IdentityResourcesDTO;
};

export default function IdentityResourceForm<Props>(
  resource: IdentityResourcesDTO
) {
  const { register, handleSubmit, errors, formState } = useForm<
    IdentityResourcesDTO
  >();
  const { isSubmitting } = formState;
  const [response, setResponse] = useState<APIResponse>(null);
  // TODO: FIX
  resource = resource.resource;

  const back = () => {
    // TODO: Go back
    // const router = useRouter();
    // router.back();
  };

  const save = async (data) => {
    await api
      .post('identity-resource', data.resource)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        }
      });
  };

  return (
    <div className="identity-resource">
      <StatusBar status={response}></StatusBar>
      <div className="identity-resource__wrapper">
        

        <div className="identity-resource__container">
          <h1>Create new Identity Resource</h1>
          <div className="identity-resource__container__form">
          <div className="identity-resource__help">
          Enter some basic details for this client. Click advanced to configure preferences if default settings need to be changed. 
          You will then go through steps to configure and add additional properties.
        </div>
        
            <form onSubmit={handleSubmit(save)}>
              <div className="identity-resource__container__fields">
                <div className="identity-resource__container__field">
                  <label htmlFor="name" className="identity-resource__label">
                    Name
                  </label>
                  <input
                    ref={register({ required: true })}
                    id="name"
                    name="resource.name"
                    type="text"
                    className="identity-resource__input"
                    defaultValue={resource.name}
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="resource.name"
                    message="Name is required"
                  />
                </div>
                <div className="identity-resource__container__field">
                  <label
                    htmlFor="displayName"
                    className="identity-resource__label"
                  >
                    Display Name
                  </label>
                  <input
                    ref={register({ required: true })}
                    id="displayName"
                    name="resource.displayName"
                    type="text"
                    className="identity-resource__input"
                    defaultValue={resource.displayName}
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="resource.displayName"
                    message="DisplayName is required"
                  />
                </div>
                <div className="identity-resource__container__field">
                  <label
                    htmlFor="description"
                    className="identity-resource__label"
                  >
                    Description
                  </label>
                  <input
                    ref={register({ required: true })}
                    id="description"
                    name="resource.description"
                    type="text"
                    defaultValue={resource.description}
                    className="identity-resource__input"
                  />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="resource.description"
                    message="Description is required"
                  />
                </div>

                <div className="identity-resource__container__checkbox__field">
                  <label htmlFor="enabled" className="identity-resource__label">
                    Enabled
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="resource.enabled"
                    type="checkbox"
                    defaultChecked={resource.enabled}
                    className="identity-resource__checkbox"
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                </div>

                <div className="identity-resource__container__checkbox__field">
                  <label
                    htmlFor="emphasize"
                    className="identity-resource__label"
                  >
                    Emphasize
                  </label>
                  <input
                    ref={register}
                    id="emphasize"
                    name="resource.emphasize"
                    defaultChecked={resource.emphasize}
                    type="checkbox"
                    className="identity-resource__checkbox"
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                </div>

                <div className="identity-resource__container__checkbox__field">
                  <label
                    htmlFor="required"
                    className="identity-resource__label"
                  >
                    Required
                  </label>
                  <input
                    ref={register}
                    id="required"
                    name="resource.required"
                    defaultChecked={resource.required}
                    type="checkbox"
                    className="identity-resource__checkbox"
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                </div>

                <div className="identity-resource__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="identity-resource__label"
                  >
                    Show In Discovery Document
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="resource.showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={resource.showInDiscoveryDocument}
                    className="identity-resource__checkbox"
                  />
                  <HelpBox helpText="Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorem architecto a odit ea distinctio consequatur autem nesciunt cupiditate eos, error reprehenderit illum dolor, mollitia modi vitae. Ducimus esse eos explicabo." />
                </div>

                <div className="identity-resource__buttons__container">
                  <div className="identity-resource__button__container">
                    <button
                      className="identity-resource__button__cancel"
                      onClick={back}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="identity-resource__button__container">
                    <input
                      type="submit"
                      className="identity-resource__button__save"
                      disabled={isSubmitting}
                      value="Save"
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
