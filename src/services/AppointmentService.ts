import ApiService from "./ApiService";

export async function getAppointment<T>(
) {
    return ApiService.fetchData<T>({
        url: `/api/appointment/getAppointment`,
        method: 'get',
    });
}

export async function getAppointmentId<T>(doctorId: number)
     {
        return ApiService.fetchData<T>({
            url: `/api/appointment/getAppointmentByDoctor/${doctorId}`,
            method: 'get',
        });
    }
    
export async function apiSearchByPatients<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/api/patient/searchPatient',
        method: 'post',
        data,
    })
}

export async function apiTodaysAppointment<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/api/appointment/getAppointmentBYFacilityAndDoc`,
        method: 'get',
        params: data
    });
}
export async function apiGetAppointmentByDate<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: `/api/appointment/getAppointmentByDate`,
        method: 'get',
        params: data
    });
}
export async function apiChangeStatus<T, U extends Record<string, unknown>>(
    params: number
) {
    return ApiService.fetchData<T>({
        url: `/api/appointment/toggleAppointmentStatus/${params}`,
        method: 'put',

    });
}

// export async function deleteAppointment<T>(appointmentId: number) {

//     return ApiService.fetchData<T>({

//         url: `http://localhost:8080/api/appointment/deleteById/${appointmentId}`,
//         method: 'delete',

//     });

// }      

export async function deleteAppointment<T>(id: number) {
    return ApiService.fetchData<T>({
      url: `/api/appointment/deleteById/${id}`,
      method: 'delete',
    });
  }

export async function todaysTotolAppointment<T, U extends Record<string, unknown>>(
    
) {
    return ApiService.fetchData<T>({
        url: `/api/appointment/todaysTotolAppointment`,
        method: 'get',
    });
}


    export async function getPayment<T, U extends Record<string, unknown>>(
        data: U
    ) {
        return ApiService.fetchData<T>({
            url: `/api/appointment/getPayment`,
            method: 'get',
            params: data
        });
    }