import { apiSlice as api } from '@renderer/store/slices/apiSlice'
import { BaseResponse } from '@renderer/types/base'
import { CreateToolUsageInterface, EntityToolUsageInterface, UpdateToolUsageInterface } from '@renderer/types/toolUsage'

export const addTagTypes = ['TOOL_USAGE', 'TOOL_USAGE_QUARANTINE']

const ToolApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
  endpoints: (build) => ({
    fetchToolUsage: build.query<
      BaseResponse<EntityToolUsageInterface[]>,
      { mcCd: string | undefined; mcComId: string | undefined; page: number; perPage: number }
    >({
      query: ({ mcCd, mcComId, page, perPage }) => ({
        url: '/toolusage',
        params: { mcCd, mcComId, page, perPage }
      }),
      providesTags: ['TOOL_USAGE']
    }),
    fetchToolQurantine: build.query<
      BaseResponse<EntityToolUsageInterface[]>,
      { isLock: boolean | undefined; mcCd: string | undefined; mcComId: string | undefined; page: number; perPage: number }
    >({
      query: ({ isLock, mcCd, mcComId, page, perPage }) => ({
        url: '/toolusage/quarantine',
        params: { isLock, mcCd, mcComId, page, perPage }
      }),
      providesTags: ['TOOL_USAGE_QUARANTINE']
    }),
    CreateToolUsage: build.mutation<BaseResponse<unknown>, CreateToolUsageInterface>({
      query: ({ ...rest }) => ({
        url: '/toolusage',
        method: 'POST',
        data: rest
      }),
      invalidatesTags: ['TOOL_USAGE']
    }),
    UpdateToolUsage: build.mutation<
      BaseResponse<unknown>,
      { data: UpdateToolUsageInterface; id: number }
    >({
      query: ({ data, id }) => ({
        url: `/toolusage/${id}`,
        method: 'PUT',
        data: { ...data }
      }),
      invalidatesTags: ['TOOL_USAGE']
    }),
    UpdateToolUsageBatch: build.mutation<
      BaseResponse<unknown>,
      { mcCd: string, mcComId: string, usage: number }
    >({
      query: ({ mcCd, mcComId, usage }) => ({
        url: `/toolusage/update-and-lock`,
        method: 'POST',
        params: { mcCd, mcComId, usage }
      }),
      invalidatesTags: ['TOOL_USAGE']
    }),
    LockQurantine: build.mutation<
      BaseResponse<unknown>,
      { id: number }
    >({
      query: ({ id }) => ({
        url: `/toolusage/quarantine/${id}/lock`,
        method: 'PATCH',
      }),
      invalidatesTags: ['TOOL_USAGE_QUARANTINE']
    }),
    DeleteToolUsage: build.mutation<BaseResponse<unknown>, { id: number }>({
      query: ({ id }) => ({
        url: `/toolusage/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['TOOL_USAGE']
    })
  }),
  overrideExisting: false
})

export default ToolApi
export const {
  useFetchToolUsageQuery,
  useFetchToolQurantineQuery,
  useCreateToolUsageMutation,
  useDeleteToolUsageMutation,
  useUpdateToolUsageMutation,
  useUpdateToolUsageBatchMutation,
  useLockQurantineMutation
} = ToolApi
