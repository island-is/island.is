# API

To create a new domain, run:
`yarn generate @nx/nest:library libs/api/domains/<new_domain_name>`

When prompted for project name and where it should be generated, choose the `derived` lib option.

After generation, open `project.json` in your new lib's folder and add `"tags": ["lib:api", "scope:api"]`
