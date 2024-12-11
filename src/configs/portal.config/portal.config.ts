import { PortalState } from '@renderer/store'

export const portalNavigationConfig: Record<string, PortalState> = {
  oeeinsight: {
    navigation: [
      {
        key: 'OEEInsight',
        path: '/app/apq/dashboard',
        title: 'OEEInsight',
        translateKey: 'oeeInsight',
        type: 'title',
        authority: []
      },
      {
        key: 'OEEUpload',
        path: '/app/apq/upload',
        title: 'OEEUpload',
        translateKey: 'oeeUpload',
        type: 'title',
        authority: []
      }
    ]
  },
  mnworkorder: {
    navigation: [
      {
        key: 'MNWorkOrder',
        path: '/maintenance-workorder',
        title: 'MN WorkOrder',
        translateKey: 'mnWorkOrder',
        type: 'title',
        authority: ['user', 'admin']
      }
    ]
  },
  toolmonitor: {
    navigation: [
      {
        key: 'ToolMonitor',
        path: '/app/tools/table',
        title: 'Tool Monitor',
        translateKey: 'ToolMonitor',
        type: 'title',
        authority: ['user', 'admin']
      },
      {
        key: 'QuarantineMonitor',
        path: '/app/tools/table/quarantine',
        title: 'Quarantine Monitor',
        translateKey: 'QuarantineMonitor',
        type: 'title',
        authority: ['user', 'admin']
      },
      {
        key: 'HistoryMonitor',
        path: '/app/tools/table/history',
        title: 'History Monitor',
        translateKey: 'HistoryMonitor',
        type: 'title',
        authority: ['user', 'admin']
      }
    ]
  },
  qsense: {
    navigation: [
      {
        key: 'QSense',
        path: '/app/qsense/quality/guard',
        title: 'QSense',
        translateKey: 'QSense',
        type: 'title',
        authority: ['user', 'admin']
      }
    ]
  },
  threeview: {
    navigation: [
      {
        key: 'MasterMachineMaintenance',
        path: 'app/threeview/machine/info',
        title: 'Master Machine Maintenance',
        translateKey: 'Master Machine Maintenance',
        type: 'title',
        authority: ['user', 'admin']
      },
      {
        key: 'EquipmentDailyInspectionInfo',
        path: 'app/threeview/equipment/daily/inspection/info',
        title: 'Equipment Daily Inspection Info',
        translateKey: 'Equipment Daily Inspection Info',
        type: 'title',
        authority: ['user', 'admin']
      }
    ]
  },
  powerusage: {
    navigation: [
      {
        key: 'EnergyPowerUsageCard',
        path: 'app/energy/card/power-usage',
        title: 'Energy Power Usage Card',
        translateKey: 'Energy Power Usage Card',
        type: 'title',
        authority: ['user', 'admin']
      },
    ]
  }
}
