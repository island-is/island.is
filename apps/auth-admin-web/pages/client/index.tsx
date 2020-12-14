import ClientDTO from '../../models/dtos/client-dto';
import ClientForm from '../../components/ClientForm';
import React, { useState } from 'react';
import ClientClaim from './../../components/ClientClaim';
import { ClientClaimDTO } from './../../models/dtos/client-claim.dto';
import ClientRedirectUriForm from '../../components/ClientRedirectUriForm';
import { ClientRedirectUriDTO } from './../../models/dtos/client-redirect-uri.dto';
import ClientIdpRestrictionsForm from '../../components/ClientIdpRestrictionsForm';
import ClientPostLogoutRedirectUriForm from '../../components/ClientPostLogoutRedirectUriForm';

import { useRouter } from 'next/router';
import StepEnd from './../../components/form/StepEnd';
import { Steps } from './../../models/utils/Steps';

export default function Index() {
  const [step, setStep] = useState(1);
  const [client, setClient] = useState<ClientDTO>(null);
  const router = useRouter();

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
    if (clientSaved.clientId) {
      setClient(clientSaved);
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
    case Steps.Client:
      return (
        <ClientForm
          handleCancel={handleCancel}
          client={new ClientDTO()}
          onNextButtonClick={handleClientSaved}
        />
      );
    case Steps.ClientRedirectUri: {
      // Set the callback URI .. ALLT
      const rObj = new ClientRedirectUriDTO();
      rObj.clientId = client.clientId;
      return (
        <ClientRedirectUriForm
          redirectObject={rObj}
          uris={null}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    }
    case Steps.ClientIdpRestrictions: {
      return (
        <ClientIdpRestrictionsForm
          clientId={client.clientId}
          restrictions={[]}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    }
    case Steps.ClientPostLogoutRedirectUri: {
      return (
        <ClientPostLogoutRedirectUriForm
          clientId={client.clientId}
          defaultUrl={''}
          uris={null}
          handleNext={handleNext}
          handleBack={handleBack}
        />
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
