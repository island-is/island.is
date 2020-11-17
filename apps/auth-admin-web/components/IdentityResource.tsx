import React, { SyntheticEvent } from "react";
import IdentityResourcesDTO from "../models/dtos/identity-resources-dto";
import axios from "axios";
import StatusBar from "./StatusBar";
import { __asyncValues } from 'tslib';
import { useForm } from "react-hook-form";
import ResourcesCard from './IdentityResources';
import { ErrorMessage } from '@hookform/error-message';


type Props = {
  resource: IdentityResourcesDTO;
};

export default function IdentityResource<Props> (resource: IdentityResourcesDTO) {
  const { register, handleSubmit, errors, formState } = useForm<IdentityResourcesDTO>();
  const { isDirty, isSubmitting } = formState;
  resource = resource.resource;
  console.log(resource);
  
  const back = () => {
    // TODO: Go back
    // const router = useRouter();
    // router.back();
  };

  const save = async (data: IdentityResourcesDTO) => {
    console.log(data);

    const response = await axios.post("api/resources/identity-resource", data).catch((err) => {
       console.log(err);
     });

     console.log(response);
    
  };

  
    return( 
    <div className="identity-resource">
    <div className="identity-resource__wrapper">
      <div className="identity-resource__help">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur
        sed alias neque ullam repudiandae, iste reiciendis suscipit rerum
        officiis necessitatibus doloribus incidunt libero distinctio
        consequuntur voluptatibus tenetur aliquid ut inventore!
      </div>

      <div className="identity-resource__container">
        <h1>Create new Identity Resource</h1>
        <div className="identity-resource__container__form">
              <form onSubmit={handleSubmit(save)}>
                <div className="identity-resource__container__fields">
                  <div className="identity-resource__container__field">
                    <label htmlFor="key" className="identity-resource__label">
                      Key</label>
                    <input
                    ref={register({ required: true })}
                      id="key"
                      type="text"
                      name="resource.key"
                      defaultValue={resource.key}
                      className="identity-resource__input"
                    />
                    <ErrorMessage as="span" errors={errors} name="resource.key" message="Key is required" />
                    
                  </div>
                  <div className="identity-resource__container__field">
                    <label htmlFor="name" className="identity-resource__label">Name</label>
                    <input
                        ref={register({ required: true })}
                      id="name"
                      name="resource.name"
                      type="text"
                      className="identity-resource__input"
                      defaultValue={resource.name}
                    />
                    <ErrorMessage as="span" errors={errors} name="resource.name" message="Name is required" />
                  </div>
                  <div className="identity-resource__container__field">
                    <label htmlFor="displayName" className="identity-resource__label">Display Name</label>
                    <input
                    ref={register({ required: true })}
                      id="displayName"
                      name="resource.displayName"
                      type="text"
                      className="identity-resource__input"
                      defaultValue={resource.displayName}
                    />
                      <ErrorMessage as="span" errors={errors} name="resource.displayName" message="DisplayName is required" />
                    
                  </div>
                  <div className="identity-resource__container__field">
                    <label htmlFor="description" className="identity-resource__label">Description</label>
                    <input
                        ref={register}
                      id="description"
                      name="resource.description"
                      type="text"
                      defaultValue={resource.description}
                      className="identity-resource__input"
                    />
                  </div>

                  <div className="identity-resource__container__field">
                    <label htmlFor="enabled" className="identity-resource__label">Enabled</label>
                    <input
                    ref={register}
                      id="enabled"
                      name="resource.enabled"
                      type="checkbox"
                      defaultChecked={resource.enabled}
                      className="identity-resource__checkbox"
                    />
                  </div>

                  <div className="identity-resource__container__field">
                    <label htmlFor="emphasize" className="identity-resource__label">Emphasize</label>
                    <input
                    ref={register}
                      id="emphasize"
                      name="resource.emphasize"
                      defaultChecked={resource.emphasize}
                      type="checkbox"
                      className="identity-resource__checkbox"
                    />
                  </div>


                  <div className="identity-resource__container__field">
                    <label htmlFor="required" className="identity-resource__label">Required</label>
                    <input
                    ref={register}
                      id="required"
                      name="resource.required"
                      defaultChecked={resource.required}
                      type="checkbox"
                      className="identity-resource__checkbox"
                    />
                  </div>

                  <div className="identity-resource__container__field">
                    <label htmlFor="showInDiscoveryDocument" className="identity-resource__label">Show In Discovery Document</label>
                    <input
                        ref={register}
                      id="showInDiscoveryDocument"
                      name="resource.showInDiscoveryDocument"
                      type="checkbox"
                      defaultChecked={resource.showInDiscoveryDocument}
                      className="identity-resource__checkbox"
                    />
                    {resource.showInDiscoveryDocument}
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
    )
  }


