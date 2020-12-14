import ClientDTO from '../../models/dtos/client-dto';
import ClientForm from '../../components/ClientForm';
import ClientRedirectUriForm from '../../components/ClientRedirectUriForm';
import ClientIdpRestrictionsForm from '../../components/ClientIdpRestrictionsForm';
import ClientPostLogoutRedirectUriForm from '../../components/ClientPostLogoutRedirectUriForm';
import ClientStepNav from '../../components/ClientStepNav';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Steps } from '../../models/utils/Steps';
import { Client } from '../../models/client.model';
import { CastHelper } from './../../utils/CastHelper';

const Index = () => {
  const { query } = useRouter();
  const clientId = query.client;

  const [step, setStep] = useState(1);
  const [client, setClient] = useState<Client>(new Client());
  const router = useRouter();

  const getClient = async (clientId: string) => {
    await axios
      .get(`/api/clients/${clientId}`)
      .then((response) => {
        console.log('RESPONSE');
        console.log(response);
        console.log(response.data);
        setClient(response.data);
        console.log(client);
      })
      .catch(function (error) {
        if (error.response) {
        }
      });
  };

  useEffect(() => {
    async function loadClient() {
      if (clientId) {
        await getClient(clientId as string);
      }
    }
    loadClient();
    setStep(1);
  }, [clientId]);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleStepChange = (step: Steps) => {
    setStep(step);
  }

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
    console.log(clientSaved);
    if (clientSaved) {
      setClient(clientSaved);
      if (clientSaved.clientType === 'spa') {
        setStep(2);
        console.log('Setting step 2');
      } else {
        console.log('Setting step 3');
        setStep(3);
      }
    }
  };

  const handleClaimSaved = (claim: ClientClaimDTO) => {
    console.log(claim.clientId);
  };

  console.log(step);
  console.log(client);

  switch (step) {
    case Steps.Client:
      return (
        <ClientStepNav handleStepChange={handleStepChange}>
          <ClientForm
            handleCancel={handleCancel}
            client={client as ClientDTO}
            onNextButtonClick={handleClientSaved}
        />
        </ClientStepNav>
        
      );
    case Steps.ClientRedirectUri: {
      // Set the callback URI .. ALLT
      const rObj = new ClientRedirectUriDTO();
      rObj.clientId = client.clientId;
      return (
        <ClientStepNav handleStepChange={handleStepChange}>
        <ClientRedirectUriForm
          redirectObject={client}
          uris={CastHelper.IdpRestrictionToStringArray(client.redirectUris)}
          handleNext={handleNext}
          handleBack={handleBack}
        />
        </ClientStepNav>
      );
    }
    case Steps.ClientIdpRestrictions: {
      return (
        <ClientStepNav handleStepChange={handleStepChange}>
        <ClientIdpRestrictionsForm
          clientId={client.clientId}
          restrictions={CastHelper.IdpRestrictionToStringArray(client.identityProviderRestrictions)}
          handleNext={handleNext}
          handleBack={handleBack}
        />
        </ClientStepNav>
      );
    }
    case Steps.ClientPostLogoutRedirectUri: {
      return (
        <ClientStepNav handleStepChange={handleStepChange}>
        <ClientPostLogoutRedirectUriForm
          clientId={client.clientId}
          defaultUrl={''}
          uris={null}
          handleNext={handleNext}
          handleBack={handleBack}
        />
        </ClientStepNav>
      );
    }
    case Steps.ClientAllowedCorsOrigin: {
      // Allowed Cors Origin
      // Default Display URL ?
    }
    case Steps.ClientGrantTypes: {
      // Grant Types
      // Authorization code ALLT NEMA SERVICE TO SERVICE - [Client credentials - SERVICE to SERVICE]
    }
    case Steps.ClientAllowedScopes: {
      // Allowed Scopes
      // Ákveðin scope sem við eigum og veljum úr lista - Skilgreinum scopes fyrir resource-a
      // Sett á bið?
    }
    case Steps.ClientClaims: {
      // Add Claims - Custom Claims (Vitum ekki alveg) - Setja í BID
      //    const claim = new ClientClaimDTO();
      //    console.log("Client ID: " + client);
      //    claim.clientId = client;
      //    return <ClientClaim claim={claim} handleSaved={handleClaimSaved} />
    }
    case Steps.ClientSecret: {
      //ClientSecret
      // EF SPA eða NATIVE þá sýna ekkert
      // Generate og sýna
    }
    default: {
      // TODO: Temp
      return (<div>Step not found</div>
        
      );
    }
  }
};

export default Index;
