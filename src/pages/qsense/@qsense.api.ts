import { apiSlice as api } from "@renderer/store/slices/apiSlice";
import { BaseResponse } from "@renderer/types/base";
import { LiveDowntimesId } from "./mqtt.types";


export const addTagTypes = ["FIND_DONWTIMES", "DT"];

const QSenseApi = api.enhanceEndpoints({ addTagTypes }).injectEndpoints({
	endpoints: (build) => ({
		findDowntimes: build.query<BaseResponse<LiveDowntimesId[]>, {
			mcCd: string;
			comId: string;
		}>({
			query: ({ mcCd, comId, }) => ({
				url: '/qsense/runtime/findDowntimes',
				params: { mcCd, comId, },
			}),
			providesTags: ['FIND_DONWTIMES'],
		}),


	}),
	overrideExisting: false,
});

export default QSenseApi;

export const { useFindDowntimesQuery, } = QSenseApi;

