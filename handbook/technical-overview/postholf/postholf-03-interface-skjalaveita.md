# Skjalaveita API

Service that document providers need to implement. All of the document providers need to implement the same interface. The backend system in Island.is will call this service to retrieve documents from the document provider when a user wants to view the document.

HTTPS communication is required. The backend system will identify itself with JWT in the Authorization header using the Bearer schema. The service MUST validate the signature, issuer, expiry dates, audience and scope

## Document

The operation returns an owner's document. The service should only return a document if the identifier (SkjalId) and owner kennitala matches in the document provider systems.

> GET \$BASE_URL\$/{kennitala}/documents/{documentId}?authenticationType={authenticationType}

Request Parameters:

| Variable           | Type   | Description                                                                                                                                                                                            |
| ------------------ | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| kennitala          | String | Owners/recipients kennitala.                                                                                                                                                                           |
| documentId         | String | A unique identifier for the reference within the document provider.                                                                                                                                    |
| authenticationType | String | Strength of authentication of the user/recipient of the document. <br />LOW = User/pass <br />SUBSTANTIAL = Two factor authentication (User/Pass and additionally SMS) <br />HIGH = Client Certificate |

Response:

```json
{
  "type": "string",
  "content": "string"
}
```

| Property name | Type                  | Description                                                                                                                                                           |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| type          | String                | Document form (file ending). For example, pdf, xls, etc. If nothing is given, pdf is the default and recommended if there is not a special reason for something else. |
| content       | Base64Binary (String) | The document/file content base64 encoded.                                                                                                                             |
| **Or**        |                       |
| type          | String                | If set to “url”, island.is will redirect the user to a document delivery site. User is transferred between along with a signed SAML2 xml.                             |
| content       | String                | Url                                                                                                                                                                   |
| **Or**        |                       |
| type          |                       | If set to “html”, page with the html content will be displayed in new tab.                                                                                            |
| content       | String                | Html to display the user. The HTML must contain all "inline" to display. HTML must not contain javascript.                                                            |

# Sequence Diagram

Sequence diagram that describes how Island.is retrieves a document and displays the user. This is valid when documents that are in the form of a non-external connection are required, such as pdf.

![](./assets/sequence-diagram.png)
