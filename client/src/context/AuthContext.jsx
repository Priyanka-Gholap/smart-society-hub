// client/src/context/authContext.jsx
import { createContext, useReducer, useCallback, useEffect } from 'react';
import api from '../utils/api.js';

export const AuthContext = createContext();

const normalizeUser = (user) => {
  if (!user) {
    return null;
  }

  return {
    ...user,
    id: user.id || user._id,
  };
};

const initialState = {
  user: normalizeUser(JSON.parse(localStorage.getItem('authUser') || localStorage.getItem('user') || 'null')),
  token: localStorage.getItem('authToken') || null,
  loading: false,
  error: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, loading: true, error: null };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: normalizeUser(action.payload.user),
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'AUTH_LOGOUT':
      return { ...state, user: null, token: null, loading: false, error: null };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Persist to localStorage
  useEffect(() => {
    if (state.token) {
      localStorage.setItem('authToken', state.token);
      localStorage.setItem('authUser', JSON.stringify(state.user));
      localStorage.setItem('user', JSON.stringify(state.user));
    } else {
      localStorage.removeItem('authUser');
      localStorage.removeItem('user');
    }
  }, [state.token, state.user]);

  const register = useCallback(async (userData) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.errors || error.response?.data?.message || 'Registration failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const login = useCallback(async (email, password) => {
    dispatch({ type: 'AUTH_START' });
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    localStorage.removeItem('user');
    dispatch({ type: 'AUTH_LOGOUT' });
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const response = await api.get('/auth/me');
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: localStorage.getItem('authToken'),
        },
      });
      return { success: true, data: response.data.user };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to refresh profile';
      dispatch({ type: 'AUTH_ERROR', payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  }, []);

  const setUser = useCallback((user) => {
    dispatch({
      type: 'AUTH_SUCCESS',
      payload: {
        user,
        token: state.token,
      },
    });
  }, [state.token]);

  const updateLocation = useCallback(async (latitude, longitude) => {
    try {
      const response = await api.put('/auth/location', {
        latitude,
        longitude,
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }, []);

  return (
    <AuthContext.Provider
  value={{
    ...state,
    isAuthenticated: !!state.token,
    register,
    login,
    logout,
    refreshProfile,
    setUser,
    updateLocation,
  }}
>
      {children}
    </AuthContext.Provider>
  );
};
