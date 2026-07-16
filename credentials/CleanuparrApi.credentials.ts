import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class CleanuparrApi implements ICredentialType {
	name = 'cleanuparrApi';

	displayName = 'Cleanuparr API';

	icon = 'file:cleanuparrApi.svg' as const;

	documentationUrl = 'https://cleanuparr.github.io/Cleanuparr/';

	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'http://cleanuparr:11011',
			required: true,
			description: 'Base URL of the Cleanuparr instance (e.g. http://cleanuparr:11011). No trailing slash.',
		},
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Cleanuparr per-user API key (available once account setup is completed)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Api-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/status',
		},
	};
}
