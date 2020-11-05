# Naming Conventions

This document describes API naming conventions related to services and resources, with focus on the general consumer experience. Consistency and clear naming conventions are key to providing uniform APIs between agencies. _For further information about our naming conventions for the developer experience please refer to our_ [_coding standard_](https://github.com/island-is/handbook/blob/master/code-standards.md)_._

## General

In order to provide a consistent consumer experience across the API ecosystem and over a long period of time, all names used by an API should be:

- simple
- intuitive
- consistent

One goal of these naming conventions is to ensure that the majority of consumers can easily understand an API. It does this by encouraging the use of a simple, consistent and small vocabulary when naming methods and resources. It also enforces names to be in British English. Developers should use our [glossary](https://github.com/island-is/handbook/blob/master/glossary.md) when in trouble finding the appropriate English translation of an Icelandic concept.

Commonly accepted short forms or abbreviations of long words may be used for brevity. For example, API is preferred over Application Programming Interface. Use intuitive, familiar terminology where possible. For example, when describing removing (and destroying) a resource, delete is preferred over erase. Use the same name or term for the same concept, including for concepts shared across the ecosystem.

Name overloading should be avoided. Use different names for different concepts. Overly general names that are ambiguous within the context of the API and the larger API ecosystem should be avoided as they can lead to a misunderstanding of API concepts. Specific names that accurately describe the API concept and distinguish it from other relevant concepts should be used. There is no definitive list of names to avoid, as every name must be evaluated in their context.

**Bad**

```text
Info        // info about what?
Service     // service for what?
Application // application for what?
```

**Good**

```text
OrderStatus    // Info about Order status
OrderService   // Service that works with the Order resource
PaternityLeave // Application data for paternity leave application
```

Carefully consider using names that may conflict with keywords in common programming languages. Such names may be used but will likely trigger additional scrutiny during API review. Use them judiciously and sparingly.

## Resources

Resource names should be `singular noun` and use `PascalCase`.

**Bad**

```text
Users
user
Paternityleave
```

**Good**

```text
User
PaternityLeave
```

### URIs

The [URI](https://en.wikipedia.org/wiki/Uniform_Resource_Identifier) defined in [RFC3986](https://tools.ietf.org/html/rfc3986) consists of five components: scheme, authority, path, query and fragment.

```text
https://example.com:8042/over/there?name=ferret#nose
\___/   \______________/\_________/ \_________/ \__/
  |            |            |            |        |
scheme     authority       path        query   fragment
```

When structuring resource URIs please follow the following rules:

- [Resource names and collection IDs] must be the plural form of the singular noun used for the resource.
- Use lowercase letters for URI paths since capital letters can sometimes cause problems.
- Use hyphens (`-`) to improve readability of concatenated resource names.
- Use the forward slash (`/`) in a path to indicate hierarchical relationship between resources.
- Do not end a path with a trailing forward slash (`/`).
- Do not use underscores (`_`) as they can be partially obscured or hidden in some browsers or screens.
- For naming query parameters please use the camelCase naming convention.

Example URI of an authority and a path component

```text
example.com/v1/users/1/photos/121
\_________/ |  \___/   \____/ \_/
    |       |    |        |    \
    |       |    |        |      Resource ID
    |       |    |        |         (type)
    |       |    |         \
    |       |    |           Collection ID
    |       |    |              (type)
    |       |     \
    |       |      Resource name of parent resource
    |        \
    |          Major version
      \
        API service name
```

## Fields

Resource field names should be clear, descriptive and use `camelCase`. Fields representing arrays or lists should be named as _plural nouns_.

**Bad**

```yaml
User:
  type: object
  properties:
    Name:
      type: string
    DisplayName:
      type: string
    dspName:
      type: string
    Email:
      type: string
    child:
      type: array
```

**Good**

```yaml
User:
  type: object
  properties:
    name:
      type: string
    displayName:
      type: string
    email:
      type: string
    childs:
      type: array
```

## References

- [Google](https://cloud.google.com/apis/design/naming_convention)
- [restfulapi.net](https://restfulapi.net/resource-naming/)
