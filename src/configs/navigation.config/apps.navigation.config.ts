import { APP_PREFIX_PATH } from '@/constants/route.constant'
import {
    NAV_ITEM_TYPE_TITLE,
    NAV_ITEM_TYPE_ITEM,
    NAV_ITEM_TYPE_COLLAPSE
} from '@/constants/navigation.constant'
import type { NavigationTree } from '@/@types/navigation'
import { ADMIN, DOCTOR, ACCOUNTANT, FRONTDESK } from '@/constants/roles.constant'

const appsNavigationConfig: NavigationTree[] = [
 
    {
        key: 'apps',
        path: '',
        title: '',
        translateKey: '',
        icon: 'apps',
        type: NAV_ITEM_TYPE_TITLE,
        authority: [ADMIN, FRONTDESK,DOCTOR],
        subMenu: [
            {
                key: 'apps.home',
                path: `${APP_PREFIX_PATH}/home`,
                title: 'Home',
                translateKey: 'nav.apps.home',
                icon: 'home',
                type: NAV_ITEM_TYPE_ITEM,
                authority: [ADMIN, FRONTDESK,DOCTOR],
                subMenu: [],
            },
            
        
            {
                key: 'apps.appointment',
                path: '',
                title: 'Appointment',
                translateKey: 'nav.apps.appointment',
                icon: 'groupSingleMenu',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, DOCTOR, FRONTDESK],
                subMenu: [
                    {
                        key: 'appsAppointment.todayAppointment',
                        path: `${APP_PREFIX_PATH}/todayAppointment`,
                        title: "Today's Appointment",
                        translateKey: 'nav.appsAppointment.todayAppointment',
                        icon: 'collapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, FRONTDESK],
                        subMenu: [],
                    }
                    , {
                        key: 'appsAppointment.scheduleAppointment',
                        path: `${APP_PREFIX_PATH}/scheduleAppointment`,
                        title: 'Scheduled Appointment',
                        translateKey: 'nav.appsAppointment.scheduleAppointment',
                        icon: 'collapseMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, DOCTOR, FRONTDESK],
                        subMenu: [],
                    },
                    
                ]
            },
            {
                key: 'apps.patientAppointment',
                path: '',
                title: 'Patients',
                translateKey: 'nav.apps.patientAppointment',
                icon: 'addUser',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, DOCTOR, FRONTDESK],
                subMenu: [
                    {
                        key: 'appspatientAppointment.patientRegistration',
                        path: `${APP_PREFIX_PATH}/patientRegistration`,
                        title: 'Patient Registration',
                        translateKey: 'nav.appspatientAppointment.patientRegistration',
                        icon: 'singleMenu',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, DOCTOR, FRONTDESK],
                        subMenu: [],
                    },
                   
                    {
                        key: 'appspatientAppointment.listofpatient',
                        path: `${APP_PREFIX_PATH}/listofpatient`,
                        title: 'List of Patients',
                        translateKey: 'nav.appspatientAppointment.listofpatient',
                        icon: '',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, DOCTOR, FRONTDESK],
                        subMenu: [],
                    },
        
                ]
            },
            {
                key: 'apps.user',
                path: '',
                title: 'User',
                translateKey: 'nav.apps.user',
                icon: 'patient',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN],
                subMenu: [
        
                    {
                        key: 'appsUser.addUser',
                        path: `${APP_PREFIX_PATH}/addUser`,
                        title: 'Add User',
                        translateKey: 'nav.appsUser.addUser',
                        icon: 'addUser',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN],
                        subMenu: [],
                    },
                    {
                        key: 'appsUser.listUser',
                        path: `${APP_PREFIX_PATH}/listUser`,
                        title: 'List of User',
                        translateKey: 'nav.appsUser.listUser',
                        icon: 'listUser',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN],
                        subMenu: [],
                    },
                ]
            },
        
            {
                key: 'apps.doctor',
                path: '',
                title: 'Doctor',
                translateKey: 'nav.apps.doctor',
                icon: 'doctor',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN, FRONTDESK],
                subMenu: [
        
                    {
                        key: 'appsDoctor.doctorDashboard',
                        path: `${APP_PREFIX_PATH}/doctorDashboard`,
                        title: 'Dashboard',
                        translateKey: 'nav.appsDoctor.doctorDashboard',
                        icon: 'addUser',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN, FRONTDESK],
                        subMenu: [],
                    },
                   
                ]
        
        
            },
        
            {
                key: 'apps.payment',
                path: '',
                title: 'Payment',
                translateKey: 'nav.apps.payment',
                icon: 'patient',
                type: NAV_ITEM_TYPE_COLLAPSE,
                authority: [ADMIN,FRONTDESK],
                subMenu: [
        
                    {
                        key: 'appsPayment.paymentTable',
                        path: `${APP_PREFIX_PATH}/PaymentTable`,
                        title: 'Payment Status',
                        translateKey: 'nav.appsPayment.paymentTable',
                        icon: 'addUser',
                        type: NAV_ITEM_TYPE_ITEM,
                        authority: [ADMIN,FRONTDESK],
                        subMenu: [],
                    },
                    
        ],
    },
  ],
},

]

export default appsNavigationConfig
