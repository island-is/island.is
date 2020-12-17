import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import { IdentityResource } from 'apps/auth-admin-web/models/identity-resource.model';
import { useForm } from 'react-hook-form';
import IdentityResourcesDTO from 'apps/auth-admin-web/models/dtos/identity-resources.dto';
import HelpBox from '../../HelpBox';
import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/router';
// import ResourceUserClaim from 'apps/auth-admin-web/models/interfaces/resource-user-claims';

interface Props {
  identityResourceId: string;
}

const IdentityResourceData: React.FC<Props> = ({ identityResourceId }) => {
  const { register, handleSubmit, errors, formState } = useForm<
    IdentityResourcesDTO
  >();
  const { isSubmitting } = formState;
  const [loaded, setLoaded] = useState<boolean>(false);
  const [resource, setResource] = useState<IdentityResourcesDTO>(
    new IdentityResourcesDTO()
  );
  const router = useRouter();

  useEffect(() => {
    getResource();
  }, [loaded]);

  useEffect(() => {
    console.log('resource was changed');
    console.log(resource);
  }, [resource]);

  const getResource = async () => {
    await axios
      .get(`/api/identity-resource/` + identityResourceId)
      .then((response) => {
        setResource(response.data);
      });
  };

  const save = async (data: any) => {
    console.log('data.resource: ', data.resource);
    data.resource.name = identityResourceId;
    await axios.put(
      `/api/identity-resource/` + identityResourceId,
      data.resource
    );
  };

  const back = () => {
    router.back();
  };

  const changeEnabled = () => {
    setResource({ ... resource, enabled: !resource.enabled })
  };

  const changeEmphasize = () => {
    setResource({ ... resource, emphasize: !resource.emphasize })
  };

  const changeRequired = () => {
    setResource({ ... resource, required: !resource.required })
  };

  const changeDiscoveryDocument = () => {
    setResource({ ... resource, showInDiscoveryDocument: !resource.showInDiscoveryDocument })
  };

  return (
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
            disabled={true}
          />
          <HelpBox helpText="The resource unique name, can't be changed" />
          <ErrorMessage
            as="span"
            errors={errors}
            name="resource.name"
            message="Name is required"
          />
        </div>
        <div className="identity-resource__container__field">
          <label htmlFor="displayName" className="identity-resource__label">
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
          <label htmlFor="description" className="identity-resource__label">
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
            className="identity-resource__checkbox"
            // defaultChecked={resource.enabled}
            checked={resource.enabled}
            onChange={(e) => changeEnabled()}
          />
          <HelpBox helpText="Specifies if the resource is enabled." />
        </div>

        <div className="identity-resource__container__checkbox__field">
          <label htmlFor="emphasize" className="identity-resource__label">
            Emphasize
          </label>
          <input
            // key={Math.random()}
            ref={register}
            id="emphasize"
            name="resource.emphasize"
            type="checkbox"
            className="identity-resource__checkbox"
            // defaultChecked={resource.emphasize}
            checked={resource.emphasize}
            onChange={(e) => changeEmphasize()}
          />
          <HelpBox helpText="Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes." />
        </div>

        <div className="identity-resource__container__checkbox__field">
          <label htmlFor="required" className="identity-resource__label">
            Required
          </label>
          <input
            ref={register}
            id="required"
            name="resource.required"
            type="checkbox"
            className="identity-resource__checkbox"
            // defaultChecked={resource.required}
            checked={resource.required}
            onChange={(e) => changeRequired()}
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
            className="identity-resource__checkbox"
            // defaultChecked={resource.showInDiscoveryDocument}
            checked={resource.showInDiscoveryDocument}
            onChange={(e) => changeDiscoveryDocument()}
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
  );
};

export default IdentityResourceData;
