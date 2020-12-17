import React, { useState } from 'react';
import IdentityResourcesDTO from '../../models/dtos/identity-resources.dto';
import axios from 'axios';
import StatusBar from '../StatusBar';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import HelpBox from '../HelpBox';
import APIResponse from '../../models/utils/APIResponse';
import { useRouter } from 'next/router';

export default function IdentityResourceForm() {
  const { register, handleSubmit, errors, formState } = useForm<
    IdentityResourcesDTO
  >();
  const { isDirty, isSubmitting } = formState;
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const [resource, setResource] = useState<IdentityResourcesDTO>(
    new IdentityResourcesDTO()
  );
  const router = useRouter();

  const back = () => {
    router.back();
  };

  const save = async (data: any) => {
    await axios
      .post('api/identity-resource', data.resource)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;
        setResponse(res);

        // This is how we can direct to another page
        router.push('resources/edit/' + data.resource.name)
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
              Enter some basic details for this new identity resource. Click advanced to
              configure preferences if default settings need to be changed. You
              will then go through the steps to configure and add additional
              properties.
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
                  <HelpBox helpText="The resource unique name" />
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
                  <HelpBox helpText="The name that will be used to display the resource" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="resource.displayName"
                    message="Display Name is required"
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
                    ref={register({ required: false })}
                    id="description"
                    name="resource.description"
                    type="text"
                    defaultValue={resource.description}
                    className="identity-resource__input"
                  />
                  <HelpBox helpText="Optional to write some text that descripes the resource" />
                  {/* <ErrorMessage
                    as="span"
                    errors={errors}
                    name="resource.description"
                    message="Description is required"
                  /> */}
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
                  <HelpBox helpText="Specifies if the resource is enabled." />
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
                  <HelpBox helpText="Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes." />
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
                  <HelpBox helpText="Specifies whether the user can de-select the scope on the consent screen (if the consent screen wants to implement such a feature)" />
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
                  <HelpBox helpText="Specifies whether this scope is shown in the discovery document." />
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
