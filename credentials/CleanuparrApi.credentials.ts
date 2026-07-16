import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class CleanuparrApi implements ICredentialType {
	name = 'cleanuparrApi';

	displayName = 'Cleanuparr API';

	icon = 'file:cleanuparrApi.svg' as const;

	documentationUrl = 'https://github.com/Cleanuparr/Cleanuparr';

	// Cleanuparr's API is unauthenticated by default; only the base URL is needed.
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://cleanuparr:11011',
			required: true,
			description: 'Base URL of the Cleanuparr instance (e.g. http://cleanuparr:11011). No trailing slash.',
		},
	];
}
