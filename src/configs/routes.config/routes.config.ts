import type { Routes } from '@renderer/@types/routes'
import authRoute from './auth.Route'
import protectedRoute from './protected.Route'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [...protectedRoute]
