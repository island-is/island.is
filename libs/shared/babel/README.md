```markdown
# Babel

Shared Babel presets.

## @island.is/shared/babel/web

This package configures `babel-plugin-transform-imports` to utilize deep imports, avoiding the need to import everything from index files.

## Deep Imports

Consider a scenario with a web application that implements code-splitting per page (similar to NextJS). For example, PageA uses a `SectionA` component and PageB uses a `SectionB` component, both defined in a shared UI library. This setup results in the following code chunks:

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5rIGFcblBhZ2VBXG5lbmRcbnN1YmdyYXBoIGNodW5rIGJcblBhZ2VCXG5lbmRcblBhZ2VBIC0tPiBVSVxuUGFnZUIgLS0-IFVJXG5zdWJncmFwaCBjaHVuayBzaGFyZWRcblVJW2lzbGFuZC11aS9pbmRleC50c11cblVJIC0tPiBTZWN0aW9uQVxuVUkgLS0-IFNlY3Rpb25CXG5lbmRcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5rIGFcblBhZ2VBXG5lbmRcbnN1YmdyYXBoIGNodW5yIGJcblBhZ2VCXG5lbmRcblBhZ2VBIC0tPiBVSVxuUGFnZUIgLS0-IFVJXG5zdWJncmFwaCBjaHVuayBzaGFyZWRcblVJW2lzbGFuZC11aS9pbmRleC50c11cblVJIC0tPiBTZWN0aW9uQVxuVUkgLS0-IFNlY3Rpb25CXG5lbmRcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

Notice how PageA includes code only utilized by PageB and vice-versa because they import from a common `index.ts` file. Tree shaking applies only to code not used by the entire application.

For developer experience (DX) and module isolation, it's often preferable to import everything from `index.ts`. However, for optimal code splitting, it's best to import components directly from their defining modules, resulting in these chunks:

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5yIGFcblBhZ2VBXG5QYWdlQSAtLT4gU2VjdGlvbkFcbmVuZFxuc3ViZ3JhcGggY2h1bmsgYlxuUGFnZUJcblBhZ2VCIC0tPiBTZWN0aW9uQlxuZW5kXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5rIGFcblBhZ2VBXG5QYWdlQSAtLT4gU2VjdGlvbkFcbmVuZFxuc3ViZ3JhcGggY2h1bmsgYlxuUGFnZUJcblBhZ2VCIC0tPiBTZWN0aW9uQlxuZW5kXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

To achieve this, we configure the `babel-plugin-transform-imports` plugin to adjust import statements and employ `exportFinder` to recursively locate the actual module defining each export.
```
