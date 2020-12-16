import ClientDTO from '../../models/dtos/client-dto';
import ClientForm from '../../components/ClientForm';
import React, { useState } from 'react';
import axios from 'axios';
import ClientClaimForm from '../../components/ClientClaimForm';
import { ClientClaimDTO } from './../../models/dtos/client-claim.dto';
import ClientRedirectUriForm from '../../components/ClientRedirectUriForm';
import { ClientRedirectUriDTO } from './../../models/dtos/client-redirect-uri.dto';
import ClientIdpRestrictionsForm from '../../components/ClientIdpRestrictionsForm';
import ClientPostLogoutRedirectUriForm from '../../components/ClientPostLogoutRedirectUriForm';

import { useRouter } from 'next/router';
import StepEnd from './../../components/common/StepEnd';
import { Step } from '../../models/common/Step';
import { Client } from './../../models/client.model';
import ClientAllowedCorsOriginsForm from 'apps/auth-admin-web/components/ClientAllowedCorsOriginsForm';
import ClientAllowedScopes from 'apps/auth-admin-web/components/ClientAllowedScopesForm';

export default function Index() {
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<Client>(new Client());
  const router = useRouter();

  const getClient = async (clientId: string) => {
    await axios.get(`/api/clients/${clientId}`)
      .then((response) => {
        setClient(response.data);
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  };

  const changesMade = () => {
    getClient(client.clientId);
  }

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCancel = () => {
    router.back();
  };

  const handleFinished = () => {
    router.push('/');
  };

  const handleClientSaved = (clientSaved: ClientDTO) => {
    console.log(clientSaved.clientId);
    if (clientSaved.clientId) {
      getClient(clientSaved.clientId);

      if (clientSaved.clientType === 'spa') {
        setStep(2);
      } else {
        setStep(3);
      }
    }
  };

  const handleClaimSaved = (claim: ClientClaimDTO) => {
    console.log(claim.clientId);
  };

  switch (step) {
    case Step.Client:
      return (
        <ClientForm
          handleCancel={handleCancel}
          client={client.clientId ? client as ClientDTO : new ClientDTO()}
          onNextButtonClick={handleClientSaved}
        />
      );
    case Step.ClientRedirectUri: {
      // Set the callback URI .. ALLT
      return (
        <ClientRedirectUriForm
          clientId={client.clientId}
          defaultUrl={client.clientUri}
          uris={client.redirectUris?.map(r => r.redirectUri)}
          handleNext={handleNext}
          handleBack={handleBack}
          handleChanges={changesMade}
        />
      );
    }
    case Step.ClientIdpRestrictions: {
      return (
        <ClientIdpRestrictionsForm
          clientId={client.clientId}
          restrictions={client.identityProviderRestrictions?.map(r => r.name)}
          handleNext={handleNext}
          handleBack={handleBack}
          handleChanges={changesMade}
        />
      );
    }
    case Step.ClientPostLogoutRedirectUri: {
      return (
        <ClientPostLogoutRedirectUriForm
          clientId={client.clientId}
          defaultUrl={client.clientUri}
          uris={client.postLogoutRedirectUris?.map(p => p.redirectUri)}
          handleNext={handleNext}
          handleBack={handleBack}
          handleChanges={changesMade}
        />
      );
    }
    case Step.ClientAllowedCorsOrigin: {
      return <ClientAllowedCorsOriginsForm
          clientId={client.clientId}
          defaultOrigin={client.clientUri}
          origins={client.allowedCorsOrigins?.map(a => a.origin)}
          handleNext={handleNext}
          handleBack={handleBack}
          handleChanges={changesMade}
        />
    }
    case Step.ClientGrantTypes: {
      // Grant Types
      // Authorization code ALLT NEMA SERVICE TO SERVICE - [Client credentials - SERVICE to SERVICE]
    }
    case Step.ClientAllowedScopes: {
      return <ClientAllowedScopes
      clientId={client.clientId}
      scopes={client.allowedScopes?.length > 0 ? client.allowedScopes?.map((s) => s.scopeName) : []}
      handleChanges={changesMade}
      handleNext={handleNext}
      handleBack={handleBack}
    />
      // Allowed Scopes
      // Ákveðin scope sem við eigum og veljum úr lista - Skilgreinum scopes fyrir resource-a
      // Sett á bið?
    }
    case Step.ClientClaims: {
      // Add Claims - Custom Claims (Vitum ekki alveg) - Setja í BID
      //    const claim = new ClientClaimDTO();
      //    console.log("Client ID: " + client);
      //    claim.clientId = client;
      //    return <ClientClaim claim={claim} handleSaved={handleClaimSaved} />
    }
    case Step.ClientSecret: {
      //ClientSecret
      // EF SPA eða NATIVE þá sýna ekkert
      // Generate og sýna
    }
    default: {
      return (
        <StepEnd
          buttonText="Home"
          handleButtonFinishedClick={handleFinished}
          title="Success"
        >
          Client has been created
        </StepEnd>
      );
    }
  }
}
