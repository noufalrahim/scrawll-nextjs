/* eslint-disable @typescript-eslint/no-explicit-any */
import apiClient from "./apiClient";

export const editData = async <TData extends Record<string, any>, TResponse>(
  url: string,
  identifier: { key: string; value: any },
  data: Partial<TData>,
): Promise<TResponse> => {
  try {
    const response = await apiClient.patch<TResponse>(
      url,
      {
        identifier,
        updates: data,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      `An error occurred while editing data: ${error.message || error}`,
    );
  }
};
