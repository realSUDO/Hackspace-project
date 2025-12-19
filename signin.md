### for normal supabase auth 


import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';

const ExpoWebSecureStoreAdapter = {
  getItem: (key: string) => {
    console.debug("getItem", { key })
    return AsyncStorage.getItem(key)
  },
  setItem: (key: string, value: string) => {
    return AsyncStorage.setItem(key, value)
  },
  removeItem: (key: string) => {
    return AsyncStorage.removeItem(key)
  },
};

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
  {
    auth: {
      storage: ExpoWebSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  },
);


Create a .env file containing these variables:

EXPO_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL

EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY

Set up protected navigation#

Next, you need to protect app navigation to prevent unauthenticated users from accessing protected routes. Use the Expo SplashScreen to display a loading screen while fetching the user profile and verifying authentication status.
Create the AuthContext#

Create a React context to manage the authentication session, making it accessible from any component:

import { Session } from '@supabase/supabase-js'

import { createContext, useContext } from 'react'

export type AuthData = {

  session?: Session | null

  profile?: any | null

  isLoading: boolean

  isLoggedIn: boolean

}

export const AuthContext = createContext<AuthData>({

  session: undefined,

  profile: undefined,

  isLoading: true,

  isLoggedIn: false,

})

export const useAuthContext = () => useContext(AuthContext)

Create the AuthProvider#

Next, create a provider component to manage the authentication session throughout the app:

import { AuthContext } from '@/hooks/use-auth-context'

import { supabase } from '@/lib/supabase'

import type { Session } from '@supabase/supabase-js'

import { PropsWithChildren, useEffect, useState } from 'react'

export default function AuthProvider({ children }: PropsWithChildren) {

  const [session, setSession] = useState<Session | undefined | null>()

  const [profile, setProfile] = useState<any>()

  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Fetch the session once, and subscribe to auth state changes

  useEffect(() => {

    const fetchSession = async () => {

      setIsLoading(true)

      const {

        data: { session },

        error,

      } = await supabase.auth.getSession()

      if (error) {

        console.error('Error fetching session:', error)

      }

      setSession(session)

      setIsLoading(false)

    }

    fetchSession()

    const {

      data: { subscription },

    } = supabase.auth.onAuthStateChange((_event, session) => {

      console.log('Auth state changed:', { event: _event, session })

      setSession(session)

    })

    // Cleanup subscription on unmount

    return () => {

      subscription.unsubscribe()

    }

  }, [])

  // Fetch the profile when the session changes

  useEffect(() => {

    const fetchProfile = async () => {

      setIsLoading(true)

      if (session) {

        const { data } = await supabase

          .from('profiles')

          .select('*')

          .eq('id', session.user.id)

          .single()

        setProfile(data)

      } else {

        setProfile(null)

      }

      setIsLoading(false)

    }

    fetchProfile()

  }, [session])

  return (

    <AuthContext.Provider

      value={{

        session,

        isLoading,

        profile,

        isLoggedIn: session != undefined,

      }}

    >

      {children}

    </AuthContext.Provider>

  )

}

Create the SplashScreenController#

Create a SplashScreenController component to display the Expo SplashScreen while the authentication session is loading:

import { useAuthContext } from '@/hooks/use-auth-context'

import { SplashScreen } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export function SplashScreenController() {

  const { isLoading } = useAuthContext()

  if (!isLoading) {

    SplashScreen.hideAsync()

  }

  return null

}

Create a logout component#

Create a logout button component to handle user sign-out:

import { supabase } from '@/lib/supabase'

import React from 'react'

import { Button } from 'react-native'

async function onSignOutButtonPress() {

  const { error } = await supabase.auth.signOut()

  if (error) {

    console.error('Error signing out:', error)

  }

}

export default function SignOutButton() {

  return <Button title="Sign out" onPress={onSignOutButtonPress} />

}

And add it to the app/(tabs)/index.tsx file used to display the user profile data and the logout button:

import { Image } from 'expo-image'

import { StyleSheet } from 'react-native'

import { HelloWave } from '@/components/hello-wave'

import ParallaxScrollView from '@/components/parallax-scroll-view'

import { ThemedText } from '@/components/themed-text'

import { ThemedView } from '@/components/themed-view'

import SignOutButton from '@/components/social-auth-buttons/sign-out-button'

import { useAuthContext } from '@/hooks/use-auth-context'

export default function HomeScreen() {

  const { profile } = useAuthContext()

  return (

    <ParallaxScrollView

      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}

      headerImage={

        <Image

          source={require('@/assets/images/partial-react-logo.png')}

          style={styles.reactLogo}

        />

      }

    >

      <ThemedView style={styles.titleContainer}>

        <ThemedText type="title">Welcome!</ThemedText>

        <HelloWave />

      </ThemedView>

      <ThemedView style={styles.stepContainer}>

        <ThemedText type="subtitle">Username</ThemedText>

        <ThemedText>{profile?.username}</ThemedText>

        <ThemedText type="subtitle">Full name</ThemedText>

        <ThemedText>{profile?.full_name}</ThemedText>

      </ThemedView>

      <SignOutButton />

    </ParallaxScrollView>

  )

}

const styles = StyleSheet.create({

  titleContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    gap: 8,

  },

  stepContainer: {

    gap: 8,

    marginBottom: 8,

  },

  reactLogo: {

    height: 178,

    width: 290,

    bottom: 0,

    left: 0,

    position: 'absolute',

  },

})

Create a login screen#

Next, create a basic login screen component:

import { Link, Stack } from 'expo-router'

import { StyleSheet } from 'react-native'

import { ThemedText } from '@/components/themed-text'

import { ThemedView } from '@/components/themed-view'

export default function LoginScreen() {

  return (

    <>

      <Stack.Screen options={{ title: 'Login' }} />

      <ThemedView style={styles.container}>

        <ThemedText type="title">Login</ThemedText>

        <Link href="/" style={styles.link}>

          <ThemedText type="link">Try to navigate to home screen!</ThemedText>

        </Link>

      </ThemedView>

    </>

  )

}

const styles = StyleSheet.create({

  container: {

    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    padding: 20,

  },

  link: {

    marginTop: 15,

    paddingVertical: 15,

  },

})

Implement protected routes#

Wrap the navigation with the AuthProvider and SplashScreenController.

Using Expo Router's protected routes, you can secure navigation:

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'

import { useFonts } from 'expo-font'

import { Stack } from 'expo-router'

import { StatusBar } from 'expo-status-bar'

import 'react-native-reanimated'

import { SplashScreenController } from '@/components/splash-screen-controller'

import { useAuthContext } from '@/hooks/use-auth-context'

import { useColorScheme } from '@/hooks/use-color-scheme'

import AuthProvider from '@/providers/auth-provider'

// Separate RootNavigator so we can access the AuthContext

function RootNavigator() {

  const { isLoggedIn } = useAuthContext()

  return (

    <Stack>

      <Stack.Protected guard={isLoggedIn}>

        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

      </Stack.Protected>

      <Stack.Protected guard={!isLoggedIn}>

        <Stack.Screen name="login" options={{ headerShown: false }} />

      </Stack.Protected>

      <Stack.Screen name="+not-found" />

    </Stack>

  )

}

export default function RootLayout() {

  const colorScheme = useColorScheme()

  const [loaded] = useFonts({

    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),

  })

  if (!loaded) {

    // Async font loading only occurs in development.

    return null

  }

  return (

    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      <AuthProvider>

        <SplashScreenController />

        <RootNavigator />

        <StatusBar style="auto" />

      </AuthProvider>

    </ThemeProvider>

  )

}

You can now test the app by running:

npx expo prebuild

npx expo start --clear

### for google 

    Create a new OAuth client ID and choose Android or iOS depending on the OS you're building the app for.
        For Android, use the instructions on screen to provide the SHA-1 certificate fingerprint used to sign your Android app.
        You will have a different set of SHA-1 certificate fingerprints for testing locally and going to production. Make sure to add both to the Google Cloud Console, and add all of the Client IDs to the Supabase dashboard.
        For iOS, use the instructions on screen to provide the app Bundle ID, and App Store ID and Team ID if the app is already published on the Apple App Store.
    Register the Client ID in the Google provider page on the Dashboard.

Local development#

To use the Google provider in local development:

    Add a new environment variable:

SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET="<client-secret>"

Configure the provider:

[auth.external.google]

enabled = true

client_id = "<client-id>"

secret = "env(SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_SECRET)"

    skip_nonce_check = false

If you have multiple client IDs, such as one for Web, iOS and Android, concatenate all of the client IDs with a comma but make sure the web's client ID is first in the list.
Using the management API#

Use the PATCH /v1/projects/{ref}/config/auth Management API endpoint to configure the project's Auth settings programmatically. For configuring the Google provider send these options:

{

  "external_google_enabled": true,

  "external_google_client_id": "your-google-client-id",

  "external_google_secret": "your-google-client-secret"

}

Signing users in#

Unlike the OAuth flow which requires the use of a web browser, the native Sign in with Google flow on Android uses the Credential Manager library to prompt the user for consent.

When the user provides consent, Google issues an identity token (commonly abbreviated as ID token) that you then send to your project's Supabase Auth server. When valid, a new user session is started by issuing an access and refresh token from Supabase Auth.

By default, Supabase Auth implements nonce validation during the authentication flow. This can be disabled in production under Authentication > Providers > Google > Skip Nonce Check in the Dashboard, or when developing locally by setting auth.external.<provider>.skip_nonce_check. Only disable this if your client libraries cannot properly handle nonce verification.

When working with Expo, you can use the @react-native-google-signin/google-signin library to obtain an ID token that you can pass to supabase-js signInWithIdToken method.

Follow the Expo installation docs for installation and configuration instructions. See the supabase-js reference for instructions on initializing the supabase-js client in React Native.

import {

  GoogleSignin,

  GoogleSigninButton,

  statusCodes,

} from '@react-native-google-signin/google-signin'

import { supabase } from '../utils/supabase'

export default function () {

  GoogleSignin.configure({

    webClientId: 'YOUR CLIENT ID FROM GOOGLE CONSOLE',

  })

  return (

    <GoogleSigninButton

      size={GoogleSigninButton.Size.Wide}

      color={GoogleSigninButton.Color.Dark}

      onPress={async () => {

        try {

          await GoogleSignin.hasPlayServices()

          const response = await GoogleSignin.signIn()

          if (isSuccessResponse(response)) {

            const { data, error } = await supabase.auth.signInWithIdToken({

              provider: 'google',

              token: response.data.idToken,

            })

            console.log(error, data)

          }

        } catch (error: any) {

          if (error.code === statusCodes.IN_PROGRESS) {

            // operation (e.g. sign in) is in progress already

          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {

            // play services not available or outdated

          } else {

            // some other error happened

          }

        }

      }}

    />

  )

}
