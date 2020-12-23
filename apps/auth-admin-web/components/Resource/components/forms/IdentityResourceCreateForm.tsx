import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import HelpBox from '../../../Common/HelpBox';
import { ErrorMessage } from '@hookform/error-message';
import { ResourcesService } from './../../../../services/ResourcesService';
import IdentityResourcesDTO from './../../../../entities/dtos/identity-resources.dto';

interface Props {
  handleSave?: (object: any) => void;
  handleCancel?: () => void;
  identityResource: IdentityResourcesDTO;
}

const IdentityResourceCreateForm: React.FC<Props> = (props) => {
  const { register, handleSubmit, errors, formState } = useForm<IdentityResourcesDTO>();
  const { isSubmitting } = formState;
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [available, setAvailable] = useState<boolean>(false);
  const [nameLength, setNameLength] = useState(0);

  useEffect(() => {
    if (props.identityResource && props.identityResource.name) {
      setIsEditing(true);
      setAvailable(true);
    }
  }, [props.identityResource]);

  const checkAvailability = async (name: string) => {
    setNameLength(name.length);
    const response = await ResourcesService.getIdentityResourceByName(name);
    if (response) {
      setAvailable(false);
    } else {
      setAvailable(true);
    }
  };

  const save = async (data: any) => {
    let response = null;

    if (!isEditing) {
      response = await ResourcesService.createIdentityResource(data);
    } else {
      response = await ResourcesService.updateIdentityResource(data, data.name);
    }

    if (response) {
      if (props.handleSave) {
        props.handleSave(data);
      }
    }
  };

  return (
    <div className="api-scope-form">
      <div className="api-scope-form__wrapper">
        <div className="api-scope-form__container">
          <h1>{isEditing ? 'Edit Api Resource' : 'Create Api Resource'}</h1>
          <div className="api-scope-form__container__form">
            <div className="api-scope-form__help">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque
              officia id delectus hic a, laudantium consequatur laborum amet
              illo accusantium ut tenetur quis porro quia esse voluptate!
              Eligendi, possimus illum.
            </div>
            <form onSubmit={handleSubmit(save)}>
              <div className="api-scope-form__container__fields">
                <div className="api-scope-form__container__field">
                  <label htmlFor="name" className="api-scope-form__label">
                    Name
                  </label>
                  <input
                    ref={register({ required: true })}
                    id="name"
                    name="name"
                    type="text"
                    className="api-scope-form__input"
                    defaultValue={props.identityResource.name}
                    readOnly={isEditing}
                    onChange={(e) => checkAvailability(e.target.value)}
                  />
                  <div
                    className={`api-scope-form__container__field__available ${
                      available ? 'ok ' : 'taken '
                    } ${nameLength > 0 ? 'show' : 'hidden'}`}
                  >
                    {available ? 'Available' : 'Unavailable'}
                  </div>
                  <HelpBox helpText="The scope's unique name" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="name"
                    message="Name is required"
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="displayName"
                    className="api-scope-form__label"
                  >
                    Display Name
                  </label>
                  <input
                    ref={register({ required: true })}
                    id="displayName"
                    name="displayName"
                    type="text"
                    className="api-scope-form__input"
                    defaultValue={props.identityResource.displayName}
                  />
                  <HelpBox helpText="The name that will be used to display the scope" />
                  <ErrorMessage
                    as="span"
                    errors={errors}
                    name="displayName"
                    message="Display name is required"
                  />
                </div>
                <div className="api-scope-form__container__field">
                  <label
                    htmlFor="description"
                    className="api-scope-form__label"
                  >
                    Description
                  </label>
                  <input
                    ref={register({ required: false })}
                    id="description"
                    name="description"
                    type="text"
                    defaultValue={props.identityResource.description}
                    className="api-scope-form__input"
                  />
                  <HelpBox helpText="Describe this Api Scope" />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="enabled" className="api-scope-form__label">
                    Enabled
                  </label>
                  <input
                    ref={register}
                    id="enabled"
                    name="enabled"
                    type="checkbox"
                    defaultChecked={props.identityResource.enabled}
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies if the scope is enabled" />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label
                    htmlFor="showInDiscoveryDocument"
                    className="api-scope-form__label"
                  >
                    Show In Discovery Document
                  </label>
                  <input
                    ref={register}
                    id="showInDiscoveryDocument"
                    name="showInDiscoveryDocument"
                    type="checkbox"
                    defaultChecked={props.identityResource.showInDiscoveryDocument}
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether this scope is shown in the discovery document." />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="emphasize" className="api-scope-form__label">
                    Emphasize
                  </label>
                  <input
                    ref={register}
                    id="emphasize"
                    name="emphasize"
                    defaultChecked={props.identityResource.emphasize}
                    type="checkbox"
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes." />
                </div>

                <div className="api-scope-form__container__checkbox__field">
                  <label htmlFor="required" className="api-scope-form__label">
                    Required
                  </label>
                  <input
                    ref={register}
                    id="required"
                    name="required"
                    defaultChecked={props.identityResource.required}
                    type="checkbox"
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether the user can de-select the scope on the consent screen (if the consent screen wants to implement such a feature)" />
                </div>

                <div className="api-scope-form__buttons__container">
                  <div className="api-scope-form__button__container">
                    <button
                      className="api-scope-form__button__cancel"
                      onClick={props.handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="api-scope-form__button__container">
                    <input
                      type="submit"
                      className="api-scope-form__button__save"
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

export default IdentityResourceCreateForm;
