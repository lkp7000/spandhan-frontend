import ApiService from "./ApiService";
export async function apiCreateDoctor<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/api/doctor/createDoctor',
        method: 'post',
        data,
    })
}

export async function getDoctorById<T>(facilityId: number) {
    return ApiService.fetchData<T>({
        url: `/api/doctor/getAllDoctorByFacility/${facilityId}`,
        method: 'get',
    });
}

export async function getAllDoctors<T>(){
    return ApiService.fetchData<T>({
        url: `/api/doctor/getAllDoctor`,
        method: 'get',
    });
}    

export async function getDoctorDetails<T>(doctorId: number) {
    return ApiService.fetchData<T>({
        url: `/api/doctor/getDoctor/${doctorId}`,
        method: 'post',
    });
}    
