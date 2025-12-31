/* eslint-disable @typescript-eslint/no-explicit-any */

import { useMutation } from "@tanstack/react-query";
import { editData } from "@/apiServices/updateData";

export const useModifyData = <TData extends Record<string, any>, TResponse>(
  baseUrl: string,
) => {
  return useMutation<
    TResponse,
    Error,
    { identifier: { key: string; value: any }; updates: Partial<TData> }
  >({
    mutationFn: ({ identifier, updates }) =>
      editData<TData, TResponse>(baseUrl, identifier, updates),
  });
};
