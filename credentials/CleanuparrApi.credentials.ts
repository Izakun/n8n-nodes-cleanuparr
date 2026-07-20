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
			description:
				'Base URL of the Cleanuparr instance (e.g. http://cleanuparr:11011). No trailing slash.',
		},
		{
			displayName: 'Username',
			name: 'username',
			type: 'string',
			default: '',
			required: true,
			description: 'Cleanuparr account username (created during first-run setup)',
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description: 'Cleanuparr account password',
		},
	];

	// Cleanuparr authenticates its API with a JWT obtained from POST /api/auth/login;
	// the node performs that login, so there is no static header to inject here.
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '={{$credentials.baseUrl}}',
			url: '/api/auth/login',
			body: {
				username: '={{$credentials.username}}',
				password: '={{$credentials.password}}',
			},
		},
	};
}
