import { apiSlice as api } from "@renderer/store/slices/apiSlice";
import { BaseResponse } from "@renderer/types/base";
import { LiveDowntimesId } from "./mqtt.types";

export const addTagTypes = ['find_downtimes'];

const QSenseApi = api
	.enhanceEndpoints({
		addTagTypes,
	})
	.injectEndpoints({
		endpoints: (build) => ({
			findDowntimes: build.query<BaseResponse<LiveDowntimesId[]>,
				{
					mcCd: string;
					comId: string;
					startOfDay: string | Date;
					endOfDay: string | Date;
				}
			>({
				query: ({ mcCd, comId, startOfDay, endOfDay }) => ({
					url: '/qsense/runtime/findDowntimes',
					params: { mcCd, comId, startOfDay, endOfDay },
				}),
				providesTags: ['find_downtimes'],
			}),
		}),
		overrideExisting: false,
	});

export default QSenseApi;

export const { useFindDowntimesQuery } = QSenseApi;

