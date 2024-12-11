import type { Routes } from '@renderer/@types/routes'
import { lazy } from 'react'

const protectedRoute: Routes = [
	{
		key: 'portal',
		path: '/portal',
		component: lazy(() => import('@renderer/pages/portal/Portal')),
		authority: []
	},
	{
		key: 'apq-dashboard',
		path: '/app/apq/dashboard',
		component: lazy(() => import('@renderer/pages/apq/DashboardAPQ')),
		authority: []
	},
	{
		key: 'apq-upload',
		path: '/app/apq/upload',
		component: lazy(() => import('@renderer/pages/apq/UploadApq')),
		authority: []
	},
	{
		key: 'tools-table',
		path: '/app/tools/table',
		component: lazy(() => import('@renderer/pages/tool-usage/TableTools')),
		authority: []
	},
	{
		key: 'tools-table-qurantine',
		path: '/app/tools/table/quarantine',
		component: lazy(() => import('@renderer/pages/tool-usage/TableQuarantine')),
		authority: []
	},
	{
		key: 'tools-table-history',
		path: '/app/tools/table/history',
		component: lazy(() => import('@renderer/pages/tool-usage/TableHistory')),
		authority: []
	},
	{
		key: 'qsense-quality-guard',
		path: '/app/qsense/quality/guard',
		component: lazy(() => import('@renderer/pages/qsense/QualityGuard')),
		authority: []
	},
	{
		key: 'three-view-machine-info',
		path: 'app/threeview/machine/info',
		component: lazy(() => import('@renderer/pages/three-view/master/TableMachineInfo')),
		authority: []
	},
	{
		key: 'three-view-equipmend-daily-inspection-info',
		path: 'app/threeview/equipment/daily/inspection/info',
		component: lazy(
			() => import('@renderer/pages/three-view/machine/TableEquipmentDailyInspectionInfo')
		),
		authority: []
	},
	{
		key: 'energy-power-usage-card',
		path: 'app/energy/card/power-usage',
		component: lazy(
			() => import('@renderer/pages/power-usage/PowerUsage')
		),
		authority: []
	}
]

export default protectedRoute
