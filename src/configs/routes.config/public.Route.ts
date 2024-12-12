import type { Routes } from '@renderer/@types/routes'
import { lazy } from 'react'

const publicRoute: Routes = [
	{
		key: 'qsense-quality-log',
		path: '/app/qsense/quality/log/:comId/:mcCd',
		component: lazy(() => import('@renderer/pages/qsense/SenseLog')),
		authority: []
	},
]

export default publicRoute
