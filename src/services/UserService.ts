import axios, { AxiosResponse } from "axios";
import ApiService from "./ApiService";

export async function apiCreateUser<T, U extends Record<string, unknown>>(
    data: U
) {
    return ApiService.fetchData<T>({
        url: '/api/user/createUser',
        method: 'post',
        data,
    })
}

export async function apiGetAllUser<T>(

) {
    return ApiService.fetchData<T>({
        url: '/api/user/getAllUser',
        method: 'get',

    })
}


export async function deleteById<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/api/user/deleteById/${id}`,
        method: 'delete',
    });
}

// export async function updateuser<T>(id: any) {
//     return ApiService.fetchData<T>({
//         url: `http://localhost:8080/api/user/updateUser/${id}`,
//         method: 'put',

//     });
// }

export const updateuser = async (
    id: any,
    userData: { userName: string; password: string; email: string; role: string; },
    token: any
): Promise<AxiosResponse> => {
    try {
        const response = await axios.put(`http://localhost:8080/api/user/updateUser/${id}`,
            userData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response;
    } catch (error) {
        throw error;
    }
};


export async function getUserById<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/api/user/getUserById/${id}`,
        method: 'get',
    });
}

export async function getDoctorByUserId<T>(id: number) {
    return ApiService.fetchData<T>({
        url: `/api/doctor/getDoctorByUserId/${id}`,
        method: 'get',
    });
}