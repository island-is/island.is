import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import HelpBox from '../../../Common/HelpBox';
import { ErrorMessage } from '@hookform/error-message';
import { ApiResourcesDTO } from './../../../../entities/dtos/api-resources-dto';
import { ResourcesService } from './../../../../services/ResourcesService';

interface Props {
  handleSave?: (object: any) => void;
  handleCancel?: () => void;
  apiResource: ApiResourcesDTO;
}

const ResourceCreateForm: React.FC<Props> = (props) => {
  const { register, handleSubmit, errors, formState } = useForm<
    ApiResourcesDTO
  >();
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
      console.log(data);
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
  }

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
                    defaultValue={props.apiResource.name}
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
                  <HelpBox helpText="The resource's unique name can't be changed" />
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
                    defaultValue={props.apiResource.displayName}
                  />
                  <HelpBox helpText="The name that will be used to display the resource" />
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
                    defaultValue={props.apiResource.description}
                    className="api-scope-form__input"
                  />
                  <HelpBox helpText="Describe this Api resource" />
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
                    defaultChecked={props.apiResource.enabled}
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies if the resource is enabled" />
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
                    defaultChecked={props.apiResource.showInDiscoveryDocument}
                    className="api-scope-form__checkbox"
                  />
                  <HelpBox helpText="Specifies whether this resource is shown in the discovery document." />
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

export default ResourceCreateForm;
