# n8n-nodes-cleanuparr

[![npm version](https://img.shields.io/npm/v/n8n-nodes-cleanuparr.svg)](https://www.npmjs.com/package/n8n-nodes-cleanuparr)

n8n community node for [Cleanuparr](https://github.com/Cleanuparr/Cleanuparr) — clean *arr download queues — via its API.

Install via **Settings -> Community Nodes -> Install** -> `n8n-nodes-cleanuparr`.

## Operations
- Get Configuration, Get Health

## Credentials
Configure the base URL and authentication in the **Cleanuparr API** credential.

## Usage example

Read the system status:

1. Add the node after a trigger (e.g. *When clicking 'Test workflow'*).
2. Select your credential.
3. **Get Status**.
4. Execute the node — example output:

```json
{ "application": { "version": "2.1.0", "upTime": "3.10:22:00" } }
```

## Disclaimer
Not affiliated with or endorsed by the respective project.
