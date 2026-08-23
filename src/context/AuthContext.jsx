import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, API_BASE } from '../lib/supabase';


const AuthContext = createContext({
  user: null,
  session: null,
  profile: null,
  loading: true,
  hasAccountDetails: false,
  signInWithGoogle: async () => {},
  signOut: async () => {},
  authedFetch: async () => {},
  refreshProfile: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const authedFetch = useCallback(
    async (url, options = {}) => {
      const currentToken = session?.access_token;
      return fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: currentToken ? `Bearer ${currentToken}` : '',
        },
      });
    },
    [session]
  );

  const fetchProfile = useCallback(async (token) => {
    if (!token) {
      setProfile(null);
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const json = await res.json();
        setProfile(json.profile || null);
      } else {
        setProfile(null);
      }
    } catch {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: initSession } }) => {
      setSession(initSession);
      setUser(initSession?.user ?? null);
      if (initSession?.access_token) {
        fetchProfile(initSession.access_token).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.access_token) {
        fetchProfile(currentSession.access_token);
      } else {
        setProfile(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const refreshProfile = async () => {
    if (session?.access_token) {
      await fetchProfile(session.access_token);
    }
  };

  const value = {
    user,
    session,
    profile,
    loading,
    hasAccountDetails: Boolean(profile?.full_name && profile?.roll_no),
    signInWithGoogle,
    signOut,
    authedFetch,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};