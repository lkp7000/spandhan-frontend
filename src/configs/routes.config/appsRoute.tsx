import { lazy } from 'react'
import { APP_PREFIX_PATH } from '@/constants/route.constant'
import type { Routes } from '@/@types/routes'
import {
    ADMIN,
    ACCOUNTANT,
    DOCTOR,
    FRONTDESK,
} from '@/constants/roles.constant'

const appsRoute: Routes = [
    {
        key: 'apps.home',
        path: `${APP_PREFIX_PATH}/home`,
        component: lazy(() => import('@/views/Home')),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'appsDoctor.doctorDashboard',
        path: `${APP_PREFIX_PATH}/doctorDashboard`,
        component: lazy(() => import('@/views/dashBoard/DoctorDashboard')),
        authority: [DOCTOR, ADMIN, FRONTDESK],
    },
    {
        key: 'appsAppointment.todayAppointment',
        path: `${APP_PREFIX_PATH}/todayAppointment`,
        component: lazy(() => import('@/views/appointment/TodayAppointment')),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'appsAppointment.scheduleAppointment',
        path: `${APP_PREFIX_PATH}/scheduleAppointment`,
        component: lazy(
            () => import('@/views/appointment/ScheduleAppointment')
        ),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },

    {
        key: 'appspatientAppointment.patientRegistration',
        path: `${APP_PREFIX_PATH}/patientRegistration`,
        component: lazy(
            () =>
                import('@/views/patient/patientManagement/PatientRegistration')
        ),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'appspatientAppointment.patientRegistration',
        path: `${APP_PREFIX_PATH}/patientRegistration/:mrNo`,
        component: lazy(
            () =>
                import('@/views/patient/patientManagement/PatientRegistration')
        ),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },

    {
        key: 'appsAppointment.add-appointment',
        path: `${APP_PREFIX_PATH}/add-appointment' ? '/add-appointment':'/add-appointment/:mrNo`,
        component: lazy(() => import('@/views/appointment/AddAppointment')),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'appsPatient.search-Patient',
        path: `${APP_PREFIX_PATH}/search-Patient`,
        component: lazy(
            () => import('@/views/patient/patientManagement/SearchPatient')
        ),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'appsUser.addUser',
        path: `${APP_PREFIX_PATH}/addUser`,
        component: lazy(() => import('@/views/user/AddUser')),
        authority: [ADMIN],
    },
    {
        key: 'appsUser.addUser',
        path: `${APP_PREFIX_PATH}/addUser/:id`,
        component: lazy(() => import('@/views/user/AddUser')),
        authority: [ADMIN],
    },
    {
        key: 'Get Patient',
        path: `${APP_PREFIX_PATH}/get-Patient/:id`,
        component: lazy(
            () => import('@/views/patient/patientManagement/GetPatient')
        ),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },

    {
        key: 'addprescription',
        path: `${APP_PREFIX_PATH}/addprescription/:mrNo`,
        component: lazy(() => import('@/views/doctor/Addprescription')),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'doctorDashboard2',
        path: `${APP_PREFIX_PATH}/addprescription`,
        component: lazy(() => import('@/views/doctor/Addprescription')),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'doctorDashboard3',
        path: `${APP_PREFIX_PATH}/doctorInfo`,
        component: lazy(() => import('@/views/doctor/DoctorInfo')),
        authority: [ADMIN],
    },
    {
        key: 'appspatientAppointment.listofpatient',
        path: `${APP_PREFIX_PATH}/listofpatient`,
        component: lazy(
            () => import('@/views/patient/patientManagement/ListOfPatient')
        ),
        authority: [ADMIN, DOCTOR, FRONTDESK],
    },
    {
        key: 'appsUser.listUser',
        path: `${APP_PREFIX_PATH}/listUser`,
        component: lazy(() => import('@/views/user/ListOfUser')),
        authority: [ADMIN],
    },
    {
        key: 'appsPrescription.prescriptionList',
        path: `${APP_PREFIX_PATH}/PrescriptionList/:mrNo`,
        component: lazy(
            () => import('@/views/patient/patientManagement/PrescriptionList')
        ),
        authority: [ADMIN, FRONTDESK, DOCTOR],
    },
    {
        key: 'appsPrescription.prescriptionPreview',
        path: `${APP_PREFIX_PATH}/PrescriptionPreview/:id`,
        component: lazy(
            () => import('@/views/patient/patientManagement/GetPrescription')
        ),
        authority: [ADMIN, FRONTDESK, DOCTOR],
    },
    {
        key: 'appsPayment.paymentTable',
        path: `${APP_PREFIX_PATH}/PaymentTable`,
        component: lazy(() => import('@/views/Payment/PaymentTable')),
        authority: [ADMIN, FRONTDESK, DOCTOR],
    },
]

export default appsRoute
