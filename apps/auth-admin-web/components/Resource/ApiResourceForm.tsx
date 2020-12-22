import React from 'react';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { ApiResourcesDTO } from './../../entities/dtos/api-resources-dto';
import ResourceCreateForm from './components/forms/ResourceCreateForm';
import { ResourcesService } from './../../services/ResourcesService';

export default function ApiResourceForm() {
  // TODO: What was the plan with this? Not Used?
  const [apiResource, setApiResource] = useState<ApiResourcesDTO>(
    new ApiResourcesDTO()
  );
  const router = useRouter();

  const save = async (data: any) => {
    // Api resource does not have these two fields
    delete data.resource.emphasize;
    delete data.resource.required;

    const response = ResourcesService.createApiResource(data);
    if ( response){
      router.push('edit/api-resource/' + data.resource.name);
    }
  }

  return (
    <ResourceCreateForm
      save={save}
      hideBooleanValues={true}
      texts={{
        header: 'Create new Api resource',
        details:
          "Enter some basic details for this new api resource. You will then be directed to it's page to continue adding additional information.",
        enabled: 'Specifies if the resource is enabled',
        name: "The resource's unique name",
        displayName: 'The name that will be used to display the scope',
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
