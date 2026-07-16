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
		icon: { light: 'file:cleanuparr.svg', dark: 'file:cleanuparr.svg' },
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
					{ name: 'Get Configuration', value: 'getConfiguration', action: 'Get the configuration' },
					{ name: 'Get Health', value: 'getHealth', action: 'Get the health status' },
				],
				default: 'getConfiguration',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const URL_BY_OP: Record<string, string> = {
			getConfiguration: '/api/configuration',
			getHealth: '/health',
		};

		for (let i = 0; i < items.length; i++) {
			try {
				const credentials = await this.getCredentials('cleanuparrApi', i);
				const baseURL = (credentials.baseUrl as string).replace(/\/+$/, '');
				const operation = this.getNodeParameter('operation', i) as string;

				const url = URL_BY_OP[operation];
				if (!url) {
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`, {
						itemIndex: i,
					});
				}

				const response = await this.helpers.httpRequest({
					method: 'GET' as IHttpRequestMethods,
					baseURL,
					url,
					json: true,
				} as IHttpRequestOptions);

				returnData.push({
					json: (typeof response === 'object' && response !== null
						? response
						: { result: response }) as IDataObject,
					pairedItem: { item: i },
				});
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
