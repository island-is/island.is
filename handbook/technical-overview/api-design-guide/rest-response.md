# REST Response

A REST API should use an appropriate HTTP Status Code and Content Type when responding to a client's request.

## Content Type

An API can support multiple response content types. It's preferred to use a JSON content type by default.
When an API supports multiple content types the client can specify the desired content type with the
[`Accept` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Accept).

The following table shows a list of common content types:

| Content Type                                                            | Description                                                                                      |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [application/json](https://www.rfc-editor.org/rfc/rfc8259)              | **Default.** Content type for a JSON response body.                                              |
| [application/problem+json](https://www.rfc-editor.org/rfc/rfc7807.html) | Content type for the [Problem JSON error object](errors.md) for `4xx` and `5xx` statuse codes.   |
| [application/xml](https://www.rfc-editor.org/rfc/rfc7303#section-9.1)   | Content type for a XML response body. Should be used when the XML is unreadable by casual users. |
| [text/xml](https://www.rfc-editor.org/rfc/rfc7303#section-9.2)          | Content type for a XML response body. Should be used when the XML is readable by casual users.   |

{% hint style="info" %}  
When more details are needed in an error response the API should use an application
defined errors and supply them in an [error object](errors.md) in the response body.  
{% endhint %}

{% hint style="info" %}  
In previous version of XML [RFC3023](https://www.rfc-editor.org/rfc/rfc3023) it said that `text/xml`
was intended for XML content which a casual user is able to read, while `application/xml` is preferred
when the XML content is unreadable by casual users.  
{% endhint %}

## HTTP Status Codes

REST APIs should use the range of [`HTTP Status Codes`](https://httpstatuses.org/)
to give the clients the most appropriate result of the request processing.

An API should at least use the following HTTP Status Codes for corresponding HTTP methods:

| Code | Meaning      | GET | POST | PUT | PATCH | DELETE |
| ---- | ------------ | :-: | :--: | :-: | :---: | :----: |
| 200  | OK           |  X  |      |  X  |   X   |   X    |
| 201  | Created      |     |  X   |     |       |        |
| 204  | No Content   |  X  |      |  X  |   X   |   X    |
| 303  | See Other    |     |  X   |     |       |        |
| 400  | Bad Request  |     |  X   |  X  |   X   |        |
| 401  | Unauthorized |  X  |  X   |  X  |   X   |   X    |
| 403  | Forbidden    |  X  |  X   |  X  |   X   |   X    |
| 404  | Not Found    |  X  |  X   |  X  |   X   |   X    |
| 500  | Server error |  X  |  X   |  X  |   X   |   X    |

## General

- `401` should be returned when client fails to authenticate.
- `403` should be returned when client is authenticated but does not have necessary permission to perform the operation.
- `404` should be returned when the static path of the request does not exist on the server.
- `500` should be returned when the server encounters some unexpected error, preferably along with an [errors](errors.md) object.

## `GET`

For retrieving a resource or a collection of resources.

- `200` should be returned on success. If a collection asked for is empty or user does not have permission to access it, `200` is still to be returned with and empty array.
- `204` should be returned when a single resource requested does not exist or the user does not have permission to access it.

{% hint style="info" %}  
When a parent resource of a sub-resource collection is not found or user does not have sufficient permissions the request should return `204` response.
{% endhint %}

## `POST`

For creating a resource.

- `201` should be returned when the resource was created. The response body should contain the created resource.
- `303` should be returned if the resource already exists on the resource server. The response should contain the [`Location`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location) header with the URI of the existing resource.
- `400` should be returned if the request is invalid, i.e. the resource already exists or contains invalid fields.

## `PUT`

For updating a existing resource.

- `200` should be returned when resource is successfully updated with the updated resource in the response.
- `204` should be returned when the resource is not found or the user does not have permission to update it.
- `400` should be returned when the request is invalid, i.e. the resource contains invalid fields.

## `PATCH`

For making a partial update on a resource.

- `200` should be returned when resource is successfully updated with the updated resource in the response.
- `204` should be returned when the resource is not found or the user does not have permission to update it.
- `400` should be returned when the request is invalid, i.e. the resource contains invalid fields.

## `DELETE`

For removing a resource.

- `200` should be returned when the resource is deleted and there is a need for a content in the response.
- `204` should be returned when the resource is deleted, does not exist or the user does not have permission to delete it and there is no content in response.
