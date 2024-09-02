import ApiService from './ApiService'

export async function getDataUsingDate<T>(
    params: string
) {
    return ApiService.fetchData<T>({
        url: `/api/appointment/getDataUsingDate?facility=${params}`,
        method: 'get',
    })
}

export async function apiCreateAppointment<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/api/appointment/createAppointment',
        method: 'post',
        data,
    } )
}


export async function getAllFacilities<T>() {
    return ApiService.fetchData<T>({
      url: `/api/facility/getAllFacility`,
      method: 'get',
    });
  }