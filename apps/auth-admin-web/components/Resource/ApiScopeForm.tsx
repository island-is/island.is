import APIResponse from 'apps/auth-admin-web/models/common/APIResponse';
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import ResourceCreateForm from './components/forms/ResourceCreateForm';

export default function ApiScopeForm() {
  const [response, setResponse] = useState<APIResponse>(new APIResponse());
  const router = useRouter();

  const back = () => {
    router.back();
  };

  const save = async (data: any) => {
    await axios
      .post('/api/api-scope', data.resource)
      .then((response) => {
        const res = new APIResponse();
        res.statusCode = response.request.status;
        res.message = response.request.statusText;

        router.push('edit/api-scope/' + data.resource.name)
      })
      .catch(function (error) {
        if (error.response) {
          setResponse(error.response.data);
        }
      });
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
