# Pósthólfið

## Getting started

- Request access to the mailbox (í. Pósthólfið). You can apply for access to the mailbox at island.is' application site https://island.is/postholf/stofnanir. <br/>The application has to include information about the institution that is applying as well as information about the guarantor (í. ábyrgðaraðili) and technical point of contact.

- If the application is accepted, the technical point of contact will receive the following information:

  - ClientId / ClientSecret - To be able to use the Skjalatilkynning API
  - Audience
  - Scope

- The applicant needs to implement an executable that delivers document references to the mailbox by calling [Skjalatilkynning API](./postholf-03-interface-skjalatilkynning.md). An example can be seen in the Keyrsla section in the following link: https://github.com/digitaliceland/postholf-demo
- The applicant has to implement a callback service that returns a document when it's requested by the user. The service has to be implemented according to the [Skjalaveita API interface](./postholf-03-interface-skjalaveita.md). Example: https://github.com/digitaliceland/postholf-demo
- Information must be sent to Stafrænt Ísland regarding where (url) to call the aforementioned service.

## Content

- [Security Checklist](postholf-00-security-checklist.md)
- [Introduction](postholf-01-intro-and-overview.md)
- [Skjalatilkynning API](postholf-02-interface-skjalatilkynning.md)
- [Skjalaveita API](postholf-03-interface-skjalaveita.md)
- [Sequence Diagram](postholf-04-sequence-diagram.md)
- [Interfaces](postholf-05-interfaces.md)
