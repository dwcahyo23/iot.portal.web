import DeviceTable from '@renderer/components/power-usage/DevieTable'
import useMqtt from '@renderer/utils/hooks/useMqtt'
import { useEffect, useState } from 'react'
import { EnergyDataType } from './power.types'

function PowerUsage() {
  const topics = [
    'iot/portal/gm1/kompresor',
    'iot/portal/gm1/panel A',
    'iot/portal/gm1/panel B',
    'iot/portal/gm1/panel B1',
    'iot/portal/gm1/panel B2',
    'iot/portal/gm1/panel B2-1'
  ]
  const { messages } = useMqtt(topics)
  const [transformedData, setTransformedData] = useState<EnergyDataType[]>([])

  console.log({ messages })

  const transformData = (input: Record<string, any>) => {
    return Object.keys(input).map((key) => {
      const plant = key.split('/')[2].toUpperCase()
      const data = JSON.parse(input[key].payload) // Parsing langsung ke `payload`

      // Fungsi untuk mengambil nilai secara aman atau mengembalikan default (0 jika tidak ada)    // Function to safely extract data or return 0 if missing
      const safeGet = (obj: any, path: string, defaultValue = 0) => {
        const keys = path.split('.')
        let result = obj
        for (let key of keys) {
          if (result && result.hasOwnProperty(key)) {
            result = result[key]
          } else {
            return defaultValue
          }
        }
        return result || defaultValue
      }

      return {
        key: key.split('/')[3],
        plant: plant,
        wbp: safeGet(data, 'wbp'),
        wbpp: safeGet(data, 'wbpp'),
        start_kwh_lwbp2: safeGet(data, 'start_kwh_lwbp2'),
        start_kwh_wbp: safeGet(data, 'start_kwh_wbp'),
        lwbp1: safeGet(data, 'lwbp1'),
        lwbp2: safeGet(data, 'lwbp2'),
        day_kwh_lwbp1: safeGet(data, 'day_kwh_lwbp1'),
        day_kwh_lwbp2: safeGet(data, 'day_kwh_lwbp2'),
        day_kwh_wbp: safeGet(data, 'day_kwh_wbp'),
        buff17_mainA: safeGet(data, 'buff17_mainA'),
        byte4: safeGet(data, 'byte4'),
        total_kwh: safeGet(data, 'total_kwh'),
        day_kwh: safeGet(data, 'day_kwh'),
        wbp_lwbp: safeGet(data, 'wbp_lwbp'),
        start: safeGet(data, 'start'),
        start_kwh_lwbp1: safeGet(data, 'start_kwh_lwbp1'),
        sensorData: {
          phasa1_current: safeGet(data, 'sensorData.phasa1_current'),
          phasa2_current: safeGet(data, 'sensorData.phasa2_current'),
          phasa3_current: safeGet(data, 'sensorData.phasa3_current'),
          volt_rn: safeGet(data, 'sensorData.volt_rn'),
          volt_sn: safeGet(data, 'sensorData.volt_sn'),
          volt_tn: safeGet(data, 'sensorData.volt_tn'),
          frequency: safeGet(data, 'sensorData.frequency'),
          active_power_sum: safeGet(data, 'sensorData.active_power_sum'),
          reactive_power_sum: safeGet(data, 'sensorData.reactive_power_sum'),
          apparent_power_sum: safeGet(data, 'sensorData.apparent_power_sum'),
          power_factor_sum: safeGet(data, 'sensorData.power_factor_sum'),
          thd_v1n: safeGet(data, 'sensorData.thd_v1n'),
          thd_v2n: safeGet(data, 'sensorData.thd_v2n'),
          thd_v3n: safeGet(data, 'sensorData.thd_v3n'),
          thd_i1: safeGet(data, 'sensorData.thd_i1'),
          thd_i2: safeGet(data, 'sensorData.thd_i2'),
          thd_i3: safeGet(data, 'sensorData.thd_i3')
        }
      }
    })
  }

  useEffect(() => {
    const result = transformData(messages) // Use messages directly
    setTransformedData(result)
  }, [messages])

  console.log({ transformedData })

  return (
    <div>
      <DeviceTable data={transformedData} />
    </div>
  )
}

export default PowerUsage
