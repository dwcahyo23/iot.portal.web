export type EnergyDataType = {
	wbp: number;
	wbpp: number;
	start_kwh_lwbp2: number;
	start_kwh_wbp: number;
	lwbp1: number;
	lwbp2: number;
	day_kwh_lwbp1: number;
	day_kwh_lwbp2: number;
	day_kwh_wbp: number;
	buff17_mainA: number;
	byte4: number;
	total_kwh: number;
	day_kwh: number;
	wbp_lwbp: number;
	start: number;
	start_kwh_lwbp1: number;
	sensorData: sensorDataType

	[key: string]: string | number | object;  // Allow dynamic keys with string, number or object values
	plant: string
}

export type sensorDataType = {
	phasa1_current: number
	phasa2_current: number
	phasa3_current: number
	volt_rn: number
	volt_sn: number
	volt_tn: number
	frequency: number
	active_power_sum: number
	reactive_power_sum: number
	apparent_power_sum: number
	power_factor_sum: number
	thd_v1n: number
	thd_v2n: number
	thd_v3n: number
	thd_i1: number
	thd_i2: number
	thd_i3: number
}

