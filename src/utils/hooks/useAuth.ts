import { apiSignIn, apiSignOut, apiSignUp } from '@/services/AuthService';
import {
    setUser,
    signInSuccess,
    signOutSuccess,
    useAppSelector,
    useAppDispatch,
} from '@/store';
import appConfig from '@/configs/app.config';
import { REDIRECT_URL_KEY } from '@/constants/app.constant';
import { useNavigate } from 'react-router-dom';
import useQuery from './useQuery';
import type { SignInCredential, SignUpCredential } from '@/@types/auth';

type Status = 'success' | 'failed';

function useAuth() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const query = useQuery();
    const { token, signedIn } = useAppSelector((state) => state.auth.session);

    const signIn = async (values: SignInCredential): Promise<
        | {
            authToken(arg0: string, authToken: any): unknown;
            jwtToken: boolean;
            token: boolean;
            status: Status
            message: string
        }
        | undefined
    > => {
        try {

            const resp = await apiSignIn(values);
              console.log(resp)
            if (resp?.data) {
                const token = resp.data.jwtToken;
                const userName = resp.data.username;
                const role = resp.data.role;
                const userId = resp.data.userId;
                localStorage.setItem("token", token)
                localStorage.setItem("userName", userName)
                localStorage.setItem("role", role)
                localStorage.setItem("userId",userId)
                dispatch(signInSuccess(token));
                if (resp.data!==null) {

                    const { user } = resp.data;

                    const userAuthority = resp.data.role || ['USER']; // Set default value to ['USER'] if authority is null
                    dispatch(
                        setUser({
                            //avatar: user.avatar || '',
                            userName: resp.data.userName || 'Anonymous',
                            authority: resp.data.role,
                            email: resp.data.email || '',
                        })
                    );

                    // Store authority in local storage
                    localStorage.setItem('authority', JSON.stringify([userAuthority]));
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY);
                navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
                return { status: 'success', message: '' };
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };

    const signUp = async (values: SignUpCredential, selectedRole: string) => {
        try {
            const resp = await apiSignUp(values);

            if (resp.data) {
                const { token } = resp.data;
                dispatch(signInSuccess(token));
                if (resp.data.user) {
                    const { user } = resp.data;
                    const userAuthority = selectedRole || ''; // Set default value to 'USER' if selectedRole is null
                    dispatch(
                        setUser({
                            avatar: user.avatar || '',
                            userName: user.userName || 'Anonymous',
                            authority: [userAuthority] || '',
                            email: user.email || '',
                        })
                    );

                    // Store authority in local storage
                    localStorage.setItem('authority', JSON.stringify([userAuthority]));
                }
                const redirectUrl = query.get(REDIRECT_URL_KEY);
                console.log()
                navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);

                return { status: 'success', message: '' };
            }
        } catch (errors: any) {
            return {
                status: 'failed',
                message: errors?.response?.data?.message || errors.toString(),
            };
        }
    };

    const handleSignOut = () => {
        dispatch(signOutSuccess());
        dispatch(
            setUser({
                avatar: '',
                userName: '',
                email: '',
                authority: [''],
            })
        );
        navigate(appConfig.unAuthenticatedEntryPath);
    };

    const signOut = async () => {
        handleSignOut();
    };

    return {
        authenticated: token && signedIn,
        signIn,
        signUp,
        signOut,
    };
}

export default useAuth;
