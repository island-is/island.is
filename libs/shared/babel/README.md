# Babel

Shared babel presets.

## @island.is/shared/babel/web

Configures babel-plugin-transform-imports to use deep imports instead of importing stuff from index files.

## Deep Imports

Let's say we have a web-app which code-splits per page (like NextJS), and PageA uses a SectionA component and PageB uses a SectionB component, which are defined in our UI library. This creates the following chunks:

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5rIGFcblBhZ2VBXG5lbmRcbnN1YmdyYXBoIGNodW5rIGJcblBhZ2VCXG5lbmRcblBhZ2VBIC0tPiBVSVxuUGFnZUIgLS0-IFVJXG5zdWJncmFwaCBjaHVuayBzaGFyZWRcblVJW2lzbGFuZC11aS9pbmRleC50c11cblVJIC0tPiBTZWN0aW9uQVxuVUkgLS0-IFNlY3Rpb25CXG5lbmRcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5rIGFcblBhZ2VBXG5lbmRcbnN1YmdyYXBoIGNodW5rIGJcblBhZ2VCXG5lbmRcblBhZ2VBIC0tPiBVSVxuUGFnZUIgLS0-IFVJXG5zdWJncmFwaCBjaHVuayBzaGFyZWRcblVJW2lzbGFuZC11aS9pbmRleC50c11cblVJIC0tPiBTZWN0aW9uQVxuVUkgLS0-IFNlY3Rpb25CXG5lbmRcbiIsIm1lcm1haWQiOnsidGhlbWUiOiJkZWZhdWx0In0sInVwZGF0ZUVkaXRvciI6ZmFsc2V9)

Note that PageA gets code that is only used on PageB and vice-versa, because they are imported from the index.ts file. Tree shaking only applies to code that is not used by the whole app (unfortunately).

For DX, and isolation, it's ideal to import everything from index.ts. However, for optimal code splitting, it's ideal to import stuff from where it is actually defined, with these chunks:

[![](https://mermaid.ink/img/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5rIGFcblBhZ2VBXG5QYWdlQSAtLT4gU2VjdGlvbkFcbmVuZFxuc3ViZ3JhcGggY2h1bmsgYlxuUGFnZUJcblBhZ2VCIC0tPiBTZWN0aW9uQlxuZW5kXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)](https://mermaid-js.github.io/mermaid-live-editor/#/edit/eyJjb2RlIjoiZ3JhcGggVEJcbnN1YmdyYXBoIGNodW5rIGFcblBhZ2VBXG5QYWdlQSAtLT4gU2VjdGlvbkFcbmVuZFxuc3ViZ3JhcGggY2h1bmsgYlxuUGFnZUJcblBhZ2VCIC0tPiBTZWN0aW9uQlxuZW5kXG4iLCJtZXJtYWlkIjp7InRoZW1lIjoiZGVmYXVsdCJ9LCJ1cGRhdGVFZGl0b3IiOmZhbHNlfQ)

So we configure babel-plugin-transform-imports to change import statements and use `exportFinder` to recursively find the actual module that defines each export.
