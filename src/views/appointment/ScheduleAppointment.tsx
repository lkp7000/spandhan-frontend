import DoctorAppointment from "../doctor/DoctorAppointment"
import UserAppointment from "../user/UserAppointment"
import React from "react"

const ScheduleAppointment = () => {
    const user = localStorage.getItem('role')
    
    return (
        <>
            {(user==="frontdesk"|| user==="admin") ?<UserAppointment/>: <DoctorAppointment/>}

            
        </>
    )
}

export default ScheduleAppointment
