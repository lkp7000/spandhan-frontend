import { lazy } from 'react'
import authRoute from './authRoute'
import type { Routes } from '@/@types/routes'
import appsRoute from './appsRoute'

export const publicRoutes: Routes = [...authRoute]

export const protectedRoutes = [
   ...appsRoute,
]