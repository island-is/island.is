import React, { useState } from 'react';
import IdentityResourcesDTO from '../../entities/dtos/identity-resources.dto';

import { useForm } from 'react-hook-form';


import { useRouter } from 'next/router';
import ResourceCreateForm from './components/forms/ResourceCreateForm';
import { ResourcesService } from './../../services/ResourcesService';


export default function IdentityResourceForm() {
  // TODO: What's the plan here? Unused?
  const { register, handleSubmit, errors, formState } = useForm<
    IdentityResourcesDTO
  >();  
  // TODO: What was the plan here?
  const [resource, setResource] = useState<IdentityResourcesDTO>(
    new IdentityResourcesDTO()
  );
  const { isSubmitting } = formState;
  const back = () => {
    router.back();
  };

  const router = useRouter();

  const save = async (data: any) => {
    const response = await ResourcesService.createIdentityResource(data.resource);
    if (response){
      router.push('edit/identity-resource/' + data.resource.name)
    }
  };

  return (
    <ResourceCreateForm
      save={save}
      hideBooleanValues={false}
      texts={{
        header: 'Create new identity resource',
        details:
          "Enter some basic details for this new identity resource. You will then be directed to it's page to continue adding additional information.",
        enabled: 'Specifies if the resource is enabled',
        name: "The resource's unique name",
        displayName: 'The name that will be used to display the resource',
        description:
          'It is optional to write some text to describe this resource',
        showInDiscoveryDocument:
          'Specifies whether this resource is shown in the discovery document.',
        required:
          'Specifies whether the user can de-select the resource on the consent screen (if the consent screen wants to implement such a feature)',
        emphasize:
          'Specifies whether the consent screen will emphasize this resource (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes.',
      }}
    />
  );
}
