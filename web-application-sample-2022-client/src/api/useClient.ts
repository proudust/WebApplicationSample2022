import { QueryParameter } from "@himenon/openapi-parameter-formatter";
import { Client } from "./client";
import type { ApiClient, QueryParameters } from "./client";

function generateQueryString(
  queryParameters: QueryParameters | undefined
): string | undefined {
  if (!queryParameters) {
    return undefined;
  }
  const queries = Object.entries(queryParameters).reduce<string[]>(
    (queryStringList, [key, item]) => {
      if (!item.value) {
        return queryStringList;
      }
      if (!item.style) {
        return queryStringList.concat(`${key}=${item.value}`);
      }
      const result = QueryParameter.generate(
        key,
        item as QueryParameter.Parameter
      );
      if (result) {
        return queryStringList.concat(result);
      }
      return queryStringList;
    },
    []
  );

  return queries.join("&");
}

interface RequestOption {
  signal?: AbortSignal | null;
}

const apiClient: ApiClient<RequestOption> = Object.freeze({
  async request(
    httpMethod,
    url,
    headers,
    requestBody,
    queryParameters,
    options
  ) {
    const query = generateQueryString(queryParameters);
    const requestUrl = query ? url + "?" + encodeURI(query) : url;
    const response = await fetch(requestUrl, {
      body: JSON.stringify(requestBody),
      headers,
      method: httpMethod,
      signal: options?.signal,
    });
    return await response.json();
  },
});

const baseUrl = "";

const client = new Client(apiClient, baseUrl);

export function useClient() {
  return client;
}
