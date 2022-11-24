# Defining Monorepo Boundaries With Tags

Tags are a way to define boundaries in a monorepo. They are configured in the `project.json` file of each project, and they affect which projects can depend on each other.

The root `.eslintrc.json` file specifies our rules for each tag. We recommend reading this article [to get up to speed](https://blog.nrwl.io/mastering-the-project-boundaries-in-nx-f095852f5bf4).

## Our tag convention

Our tags are generally split in 2 categories. Generic tags and application tags.

### Generic tags

These are the most common tags, which should be applied to most of our shared libraries.

Here are the generic tags ordered from the most generic to more focused.

| Tag          | Description                                   | Can depend on                      | Can be depended on by              |
| ------------ | --------------------------------------------- | ---------------------------------- | ---------------------------------- |
| `js`         | Basic JS library.                             | `js`                               | Any project                        |
| `node`       | NodeJS server-side library.                   | `js`, `node`                       | Any server-side projects.          |
| `web`        | JS library designed for running in a browser. | `js`, `web`                        | Any browser-based project.         |
| `react`      | React library.                                | `js`, `web`, `react`               | Any react project.                 |
| `nest`       | NestJS library.                               | `js`, `node`, `nest`               | NestJS projects.                   |
| `react-next` | NextJS library.                               | `js`, `web`, `react`, `react-next` | NextJS projects.                   |
| `react-spa`  | React library using react-router.             | `js`, `web`, `react`, `react-spa`  | React projects using react-router. |

### Application tags

Simple applications can be tagged with the generic tags above, but applications which are split up into multiple library projects should define their own tags, extending one of the generic tags.

It can be just one tag which is applied to both the application project and all of the associated library projects. Or there can be multiple application tags with different rules to segments the library projects.

| Tag               | Description             | Can depend on                                        | Can be depended on by          |
| ----------------- | ----------------------- | ---------------------------------------------------- | ------------------------------ |
| `api`             | API domain project.     | `js`, `web`, `react`, `react-spa`, `api`             | Other API projects.            |
| `portals-mypages` | Service portal project. | `js`, `web`, `react`, `react-spa`, `portals-mypages` | Other service portal projects. |
| `portals-admin`   | Admin portal project.   | `js`, `web`, `react`, `react-spa`, `portals-admin`   | Other admin portal projects.   |

## Tag prefixes

The above tag **must** be prefixed by one or both of the following prefixes to opt projects into "Can depend on" and "Can be depended on by" rules.

- `scope:` - by applying a scope tag to a project, you are saying that ESLint should enforce project boundaries for that project using the "Can depend on" rules documented above.
- `lib:` - lib tags describe what kind of project it is to enforce the "Can be depended on by" rules documented above.

This may be confusing, but basically, every project should have a lib tag, and eventually every project should also have a scope tag. You should use both prefixes in projects you maintain, and at least add tags with the lib prefix in projects you depend on.

This is to help us migrate to project boundaries over time. When we have added lib and scope tags to all projects, we can get rid of the lib prefix.

### Examples

Let's say you want to enforce project boundaries in project X which is an existing NextJS project you maintain. It depends on NextJS library Y which you maintain and React library Z which you don't maintain.

First step: Open `apps/x/project.json` and add the following tag:

```json
{
  "tags": ["scope:next"]
}
```

This marks the project as a NextJS project, and tells ESLint to verify its imports. At this point ESLint would complain that project X can't import libraries Y and Z.

{% hint style="info" %}
You should not list "lib:next" in projects under the "app" folder since they should never be depended on by other projects.
{% endhint %}

Next, open `libs/y/project.json` and add the following tags:

```json
{
  "tags": ["scope:next", "lib:next"]
}
```

The `lib:next` tag allows the library to be imported by other projects with the "scope:next" tag (fixing one of the ESLint errors in project X). Again, adding `scope:next` configures ESLint to also verify the imports of library Y. It might find some boundary errors which you should fix.

Finally, open `libs/z/project.json` and add the following tag:

```json
{
  "tags": ["lib:react"]
}
```

Since this is not your project, it's enough to list "lib:react" to fix the ESLint error in project X. You can try adding "scope:react" as well, but it might trigger some tricky boundary ESLint issue which you're not in a position to deal with as part of your work.

## Fixing module boundary errors

_Oh no, I got this ESLint error, what should I do!?_

> A project tagged with "scope:X" can only depend on libs tagged with "lib:Y", "lib:Z", ... - @nrwl/nx/enforce-module-boundaries

Check which library you are importing. If your project should be able to import that library, then it's likely just a matter of configuring the correct "lib:" tag in the library's `project.json` file.

In some cases, your project should not be importing that library, e.g. it's a library belonging to another application, or you're accidentally importing a server side library from a web project. You should look for ways to refactor your code to not depend on that library. For example, you might move the things you need to another shared library which you are allowed to depend on.
