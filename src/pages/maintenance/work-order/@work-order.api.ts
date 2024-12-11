import { apiSlice as api } from "@renderer/store/slices/apiSlice";
import { EntityMnWoInterface, UpdateMnWoInterface } from "@renderer/types";
import { BaseResponse } from "@renderer/types/base";

export const addTagTypes = ['work_orders', 'work_order', 'historian_work_orders']

const WorkorderApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			getWorkorders: build.query<BaseResponse<EntityMnWoInterface[]>, {
				page?: number;
				perPage?: number;
				where?: string;
				filter?: string;
				globalFilter?: string;
				year?: number;
				month?: number;
				location?: string;
				check?: string;
				priority?: string;
			}>({
				query: () => ({
					url: '/mnwo',
					method: 'GET',
				}),
				providesTags: ['work_orders'],
			}),
			updateWorkorder: build.mutation<BaseResponse<EntityMnWoInterface>, Partial<UpdateMnWoInterface>>({
				query: ({ ...rest }) => ({
					url: '/mnwo',
					method: 'PUT',
					data: rest
				}),
				invalidatesTags: ['work_orders', 'work_order']
			}),
			getWorkorderById: build.query<BaseResponse<EntityMnWoInterface>, { id: string }>({
				query: ({ id }) => ({
					url: `/mnwo/woId`,
					method: 'GET',
					params: { id }
				}),
				providesTags: ['work_order']
			}),
			getHistorianWorkorders: build.query<BaseResponse<EntityMnWoInterface[]>, {
				mcCd: string;
				comId: string;
				woClose?: string;
				page?: number;
				perPage?: number;
			}>({
				query: ({ mcCd, comId, woClose, page, perPage }) => ({
					url: '/mnwo/historian',
					method: 'GET',
					params: { mcCd, comId, woClose, page, perPage }
				}), providesTags: ['historian_work_orders']
			})
		}),
		overrideExisting: false
	});


export default WorkorderApi

export const { useGetHistorianWorkordersQuery, useGetWorkordersQuery, useGetWorkorderByIdQuery, } = WorkorderApi

export const { useUpdateWorkorderMutation } = WorkorderApi