import React, { ReactNode } from 'react'
import { Notification, toast } from '../ui'

export const NotificationToast = (msg: string | ReactNode = '', color: any) => {
    toast.push(
        <Notification type={color} duration={4000}>
            {msg}
        </Notification>,
        {
            placement: 'top-center',
        }
    )
}