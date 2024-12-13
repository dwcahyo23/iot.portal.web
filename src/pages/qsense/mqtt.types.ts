// Define types for the response data
export interface MqttSubscription {
  node: string
  nl: number
  clientid: string
  durable: boolean
  topic: string
  qos: number
  rap: number
  rh: number
}

// Define the response structure
export interface MqttGetSubscriptionsResponse {
  data: MqttSubscription[] // Array of subscriptions
  meta: {
    limit: number // Limit of results
    page: number // Current page number
    hasnext: boolean // Whether there is a next page
  }
}


export interface OkNgCardProps {
  machineCode: string
  machineName: string
  topic: string
  online: boolean
  onOkClick: (topic: string, message: string) => void // Menambahkan machineCode ke parameter
  onNgClick: (topic: string, message: string) => void // Menambahkan machineCode ke parameter
}

export interface LiveMessage {
  status: number | boolean;
  akumulasi_counter: number;
  rpm: number;
  load_sensor1: number;
  load_sensor2: number;
  load_sensor3: number;
  load_sensor4: number;
  ts: number;
}

export interface LiveCardProps {
  comId: string;
  mcCd: string;
  // parsedMessage: LiveMessage | null;
}

export interface DowntimeCardProps {
  comId: string;
  mcCd: string;
}

export interface LiveDowntimesId {
  id: number
  downtimeStart: Date | string;
  downtimeFinish: Date | string
}




