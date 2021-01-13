import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import HelpBox from '../../Common/HelpBox';
import { ErrorMessage } from '@hookform/error-message';
import { ApiResourcesDTO } from '../../../entities/dtos/api-resources-dto';
import { ResourcesService } from '../../../services/ResourcesService';

interface Props {
  handleSave?: (object: any) => void;
  handleCancel?: () => void;
  apiResource: ApiResourcesDTO;
}

const ResourceCreateForm: React.FC<Props> = (props) => {
  const {
    register,
    handleSubmit,
    errors,
    formState,
  } = useForm<ApiResourcesDTO>();
  const { isSubmitting } = formState;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [available, setAvailable] = useState<boolean>(false);
  const [nameLength, setNameLength] = useState(0);

  useEffect(() => {
    if (props.apiResource && props.apiResource.name) {
      setIsEditing(true);
      setAvailable(true);
    }
  }, [props.apiResource]);

  const checkAvailability = async (name: string) => {
    setNameLength(name.length);
    const response = await ResourcesService.getApiResourceByName(name);
    if (response) {
      setAvailable(false);
    } else {
      setAvailable(true);
    }
  };

  const save = async (data: any) => {
    let response = null;

    if (!isEditing) {
      response = await ResourcesService.createApiResource(data);
    } else {
      response = await ResourcesService.updateApiResource(data, data.name);
    }

    if (response) {
      if (props.handleSave) {
        props.handleSave(data);
      }
    }
  };

  return (
    <div className="api-resource-form">
      <div className="api-resource-form__wrapper">
        <div className="api-resource-form__container">
          <h1>{isEditing ? 'Edit Api Resource' : 'Create Api Resource'}</h1>
          <div className="api-resource-form__container__form">
            <div className="api-resource-form__help">
              The server hosting the protected resources, and which is capable
              of accepting and responding to protected resource requests using
              access tokens.
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-resource-form__container__fields">
                <div className="api-resource-form__container__field">
                  <label className="api-resource-form__label">
                    National Id (Kennitala)
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    ref={register({
                      required: true,
                      maxLength: 10,
                      minLength: 10,
                      pattern: /\d+/,
                    })}
                    defaultValue={props.apiResource.nationalId}
                    className="api-resource-form__input"
                    placeholder="0123456789"
                    maxLength={10}
                    title="The nationalId (Kennitala) registered for the api-resource-form"
                  />
                  <HelpBox helpText="The nationalId (Kennitala) registered for the api-resource-form" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="nationalId"
                    message="NationalId must be 10 numeric characters"
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label htmlFor="name" className="api-resource-form__label">
                    Name
                  </label>
                  <input
                    ref={register({ required: true })}
                    id="name"
                    name="name"
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                  />
                  <div
                    className={`api-resource-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available ? 'Available' : 'Unavailable'}
                  </div>
                  <HelpBox helpText="The unique name of the API. This value is used for authentication with introspection and will be added to the audience of the outgoing access token." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message="Name is required"
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="api-resource-form__label"
                  >
                    Display Name
                  </label>
                  <input
                    ref={register({ required: true })}
                    id="displayName"
                    name="displayName"
                    type="text"
                    className="api-resource-form__input"
                    defaultValue={props.apiResource.displayName}
                  />
                  <HelpBox helpText="This value can be used e.g. on the consent screen." />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message="Display name is required"
                  />
                </div>
                <div className="api-resource-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-resource-form__label"
                  >
                    Description
                  </label>
                  <input
                    ref={register({ required: false })}
                    id="description"
                    name="description"
                    type="text"
                    defaultValue={props.apiResource.description}
                    className="api-resource-form__input"
                  />
                  <HelpBox helpText="This value can be used e.g. on the consent screen." />
                </div>

                <div className="api-resource-form__container__checkbox__field">
                  <label htmlFor="enabled" className="api-resource-form__label">
                    Enabled
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.apiResource.enabled}
                    className="api-resource-form__checkbox"
                  />
                  <HelpBox helpText="Indicates if this resource is enabled and can be requested." />
                </div>

                <div className="api-resource-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-resource-form__label"
                  >
                    Show In Discovery Document
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={props.apiResource.showInDiscoveryDocument}
                    className="api-resource-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether this resource is shown in the discovery document." />
                </div>

                <div className="api-resource-form__buttons__container">
                  <div className="api-resource-form__button__container">
                    <button
                      className="api-resource-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="api-resource-form__button__container">
                    <input
                      type="submit"
                      className="api-resource-form__button__save"
                      disabled={isSubmitting || !available}
                      value="Next"
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
};

export default ResourceCreateForm;
