import React from 'react';
import { useRouter } from 'next/router';
import ResourceCreateForm from './components/forms/ResourceCreateForm';
import { ResourcesService } from './../../services/ResourcesService';

export default function ApiScopeForm() {
  
  const router = useRouter();

  // TODO: Whats the plan here? Not used?
  const back = () => {
    router.back();
  };

  const save = async (data: any) => {
    const response = ResourcesService.createApiScope(data.resource);
    if (response) {
      router.push('edit/api-scope/' + data.resource.name)
    }
  };

  return (
    <ResourceCreateForm
      save={save}
      hideBooleanValues={false}
      texts={{
        header: 'Create new Api scope',
        details:
          "Enter some basic details for this new api scope. You will then be directed to it's page to continue adding additional information.",
        enabled: 'Specifies if the scope is enabled',
        name: "The scope's unique name",
        displayName: 'The name that will be used to display the scope',
        description:
          'It is optional to write some text to describe this scope',
        showInDiscoveryDocument:
          'Specifies whether this scope is shown in the discovery document.',
        required:
          'Specifies whether the user can de-select the scope on the consent screen (if the consent screen wants to implement such a feature)',
        emphasize:
          'Specifies whether the consent screen will emphasize this scope (if the consent screen wants to implement such a feature). Use this setting for sensitive or important scopes.',
      }}
    />
  );
}
