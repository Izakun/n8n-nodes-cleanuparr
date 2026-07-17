import {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
	NodeApiError,
	NodeConnectionTypes,
	NodeOperationError,
} from 'n8n-workflow';

export class Cleanuparr implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Cleanuparr',
		name: 'cleanuparr',
		icon: { light: 'file:cleanuparr.svg', dark: 'file:cleanuparr.dark.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Query your Cleanuparr instance through its API',
		defaults: { name: 'Cleanuparr' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'cleanuparrApi', required: true }],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Get Events', value: 'getEvents', action: 'Get the event log' },
					{ name: 'Get General Config', value: 'getGeneralConfig', action: 'Get the general config' },
					{ name: 'Get Health', value: 'getHealth', action: 'Get the health status' },
					{ name: 'Get Jobs', value: 'getJobs', action: 'Get scheduled jobs' },
					{ name: 'Get Stats', value: 'getStats', action: 'Get cleanup statistics' },
					{ name: 'Get Status', value: 'getStatus', action: 'Get the system status' },
				],
				default: 'getStatus',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const ENDPOINT_BY_OP: Record<string, { url: string; qs?: IDataObject }> = {
			getEvents: { url: '/api/events' },
			getGeneralConfig: { url: '/api/configuration/general' },
			getHealth: { url: '/health' },
			getJobs: { url: '/api/jobs' },
			getStats: { url: '/api/v2/stats', qs: { hours: 168 } },
			getStatus: { url: '/api/status' },
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('cleanuparrApi', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const operation = this.getNodeParameter('operation', i) as string;

				const endpoint = ENDPOINT_BY_OP[operation];
				if (!endpoint) {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`, {
						itemIndex: i,
					});
				}

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'cleanuparrApi',
					{
						method: 'GET' as IHttpRequestMethods,
						baseURL,
						url: endpoint.url,
						qs: endpoint.qs,
						json: true,
					} as IHttpRequestOptions,
				);

				if (Array.isArray(response)) {
					for (const element of response) {
						returnData.push({ json: element as IDataObject, pairedItem: { item: i } });
					}
				} else {
					returnData.push({
						json: (typeof response === 'object' && response !== null
							? response
							: { result: response }) as IDataObject,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: (error as Error).message }, pairedItem: { item: i } });
					continue;
				}
				throw new NodeApiError(this.getNode(), error as JsonObject, { itemIndex: i });
			}
		}

		return [returnData];
	}
}
