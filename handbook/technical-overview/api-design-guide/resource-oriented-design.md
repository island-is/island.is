# Resource Oriented Design

API structure should follow Resource Oriented Design, which should facilitate simpler and more coherent web service interfaces, that should be easy to use and maintain. The data (resource) should control the design of the service, as the data is the key player and the service is centered around making the data accessible.

## Design flow

The fundamental idea is that the basic, well-understood, and well-known technologies of the current web (HTTP, URI and XML) should be used according to their design principles. This facilitates the design of web services that have simple and coherent interfaces, and which are easy to use and maintain. Such web services will also be easier to optimize for working with the existing infrastructure of the web.

The Resource-Oriented Architecture (ROA) consists of four concepts:

- Resources.
- Their names (URIs).
- Their representations.
- The links between them and the four properties:
  - Addressability.
  - Statelessness.
  - Connectedness.
  - A uniform interface.

The Design Guide suggests taking the following steps when designing resource- oriented APIs.

- Determine what types of resources an API provides.
- Determine the relationships between resources.
- Decide the resource name schemes based on types and relationships.
- Decide the resource schemas.
- Attach a minimum set of [methods](methods.md) to resources. Use the standard methods(verbs) as much as possible.

## Resources

A resource-oriented API is generally modelled as a resource hierarchy, where each node is either a simple resource or a collection resource. For convenience, they are often called a resource and a collection, respectively.

- A collection contains a list of resources of the same type. For example, a user has a collection of photos.
- A resource has some state and zero or more sub-resources. Each sub-resource can be either a simple resource or a collection resource.

A resource name consists of the resource’s type, its identifier, the resource name of its parent and the name of the API service. The type is known as the **Collection ID**, and the identifier is known as the **Resource ID**. Resource IDs are usually random strings assigned by the API service, though it is also OK to accept custom resource IDs from clients. **Collection IDs must be the plural form of the noun used for the resource and Resource IDs should be immutable**.

Below are two examples of valid resource names:

User

```text
my-service.island.is/v1/users/1
\__________________/ | \____/ |
         |           |   |    |
         |           |   |     \
         |           |   |      Resource ID
         |           |    \
         |           |     Collection ID
         |           |        (type)
         |            \
         |             Major version
         \
          API service name
```

Photo

```text
my-service.island.is/v1/users/1/photos/1
\__________________/ | \____/  \_____/ |
          |          |    |       |    |
          |          |    |       |     \
          |          |    |       |      Resource ID
          |          |    |       |        (type)
          |          |    |        \
          |          |    |         Collection ID
          |          |    |            (type)
          |          |     \
          |          |      Resource name of parent resource
          |           \
          |            Major version
          \
           API service name
```

## References

- [Google: Resource Oriented Design](https://cloud.google.com/apis/design/resources)
- [Ratros Y: Designing APIs](https://medium.com/@ratrosy/designing-apis-4eed43409f93)
- [Arnulf Christl: Towards a Resource Oriented Future](http://arnulf.us/Towards_a_Resource_Oriented_Future)
