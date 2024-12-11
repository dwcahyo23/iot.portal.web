import { SignInCredential, SignUpCredential } from '@renderer/@types/auth'
import appConfig from '@renderer/configs/app.config'
import { REDIRECT_URL_KEY } from '@renderer/constants/app.constant'
import { AuthService } from '@renderer/services/auth/auth.service'
import {
  setUser,
  setUserId,
  setUserInfo,
  signInSuccess,
  signOutSuccess,
  useAppDispatch,
  useAppSelector
} from '@renderer/store'
import { useNavigate } from 'react-router-dom'
import useQuery from './useQuery'

type Status = 'success' | 'failed'

function useAuth() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { token, signedIn } = useAppSelector((state) => state.auth.session)
  const userId = useAppSelector((state) => state.auth.userInfo.userId)
  const query = useQuery()

  const signIn = async (
    values: SignInCredential
  ): Promise<
    | {
        status: Status
        message: string
      }
    | undefined
  > => {
    try {
      const resp = await AuthService.signIn(values.nik, values.password)
      dispatch(setUserId(resp.user.uid))
      const { access_token, user, refresh_token } = resp
      dispatch(
        signInSuccess({
          token: access_token,
          refreshToken: refresh_token,
          expireTime: 0
        })
      )
      dispatch(
        setUser({
          fullName: user.data.displayName,
          role: user.role,
          nik: user.uid
        })
      )
      const redirectUrl = query.get(REDIRECT_URL_KEY)
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath)
      return {
        status: 'success',
        message: ''
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.description || errors.toString()
      }
    }
  }

  const signUp = async (_values: SignUpCredential) => {
    // try {
    //   await AuthService.signUp(values)
    //   return {
    //     status: 'success',
    //     message: ''
    //   }
    //   // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    // } catch (errors: any) {
    //   return {
    //     status: 'failed',
    //     message: errors?.response?.data?.description || errors.toString()
    //   }
    // }
  }

  const handleSignOut = () => {
    dispatch(signOutSuccess())
    dispatch(
      setUserInfo({
        googleLogin: false,
        name: '',
        role: '',
        email: '',
        userId: userId
      })
    )
    dispatch(
      setUser({
        fullName: '',
        role: [],
        email: ''
      })
    )
    navigate(appConfig.unAuthenticatedEntryPath)
  }

  const signOut = async () => {
    // await apiSignOut()
    handleSignOut()
  }

  return {
    authenticated: token && signedIn,
    signIn,
    signUp,
    signOut
  }
}

export default useAuth
