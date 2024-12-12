import type { Routes } from '@renderer/@types/routes'
import { lazy } from 'react'

const publicRoute: Routes = [
	{
		key: 'qsense-sense-logid',
		path: '/app/qsense/log/:comId/:mcCd',
		component: lazy(() => import('@renderer/pages/qsense/SenseLogId')),
		authority: []
	},
]

export default publicRoute
