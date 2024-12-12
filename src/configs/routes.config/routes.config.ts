import type { Routes } from '@renderer/@types/routes'
import authRoute from './auth.Route'
import protectedRoute from './protected.Route'
import publicRoute from './public.Route'

export const publicRoutes: Routes = [...authRoute, ...publicRoute]

export const protectedRoutes = [...protectedRoute]
