import ApiService from "./ApiService";

export async function getPrescriptionByMrNo<T>(id: any) {
    return ApiService.fetchData<T>({
      url: `/api/patient/getPatientByMrNo/${id}`,
      method: 'get',
    });
  }

  export async function apiCreatePrescription<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/api/prescription/createPrescription',
        method: 'post',
        data,
    } )
}
export async function GetPrescriptionAllData<T>(mrNo: number) {
  return ApiService.fetchData<T>({
    url: `/api/prescription/getPrescription/${mrNo}`,
    method: 'get',
  });
}
export async function GetPrescriptionById<T>(id: number) {
  return ApiService.fetchData<T>({
    url: `/api/prescription/viewPrescription/${id}`,
    method: 'get',
  });
}

 export async function GetPatientData<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/api/prescription/viewPatient',
        method: 'post',
        data,
    } )
}