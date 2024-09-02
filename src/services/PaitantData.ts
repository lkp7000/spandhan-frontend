import ApiService from "./ApiService";

export async function apiCreatePatient<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/api/patient/createPatient',
        method: 'post',
        data,
    } )
}

export async function apiGetPatientByMrNo<T>(id: number) {
    return ApiService.fetchData<T>({
      url: `/api/patient/getPatientByMrNo/${id}`,
      method: 'get',
    });
  }
  
  export async function apiGetPatientAllData<T>() {
    return ApiService.fetchData<T>({
      url: `/api/patient/getAllPatient`,
      method: 'get',
    });
  }

  export async function deleteUserData<T>(mrNo: number) {
    return ApiService.fetchData<T>({
      url: `/api/patient/deleteByMrNo/${mrNo}`,
      method: 'delete',
    });
  }

  
  // export async function updateUserData<T>(mrNo: number) {
  //   return ApiService.fetchData<T>({
  //     url: `/api/patient/updatePatient/${mrNo}`,
  //     method: 'put',
  //   });
  // }
  export async function updateUserData<T extends Record<string, unknown> | undefined>(mrNo: number, data: T) {
    return ApiService.fetchData<T>({
      url: `/api/patient/updatePatient/${mrNo}`,
      method: 'put',
      data,
    });
  }
  