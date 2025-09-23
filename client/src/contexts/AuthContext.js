import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  loading: true
};

// Action types
const AUTH_ACTIONS = {
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_LOADING: 'SET_LOADING',
  AUTH_ERROR: 'AUTH_ERROR'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    case AUTH_ACTIONS.AUTH_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Set up axios defaults
  useEffect(() => {
    if (state.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [state.token]);

  // Load user on app start
  useEffect(() => {
    const loadUser = async () => {
      if (state.token) {
        try {
          const response = await axios.get('/api/auth/me');
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: response.data.data.user,
              token: state.token
            }
          });
        } catch (error) {
          console.error('Load user error:', error);
          localStorage.removeItem('token');
          dispatch({ type: AUTH_ACTIONS.AUTH_ERROR });
        }
      } else {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, [state.token]);

  // Login function
  const login = async (email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/login', {
        email,
        password
      });

      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      toast.success('Login successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: message };
    }
  };

  // Register function
  const register = async (name, email, password) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      
      const response = await axios.post('/api/auth/register', {
        name,
        email,
        password
      });

      const { user, token } = response.data.data;
      
      localStorage.setItem('token', token);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token }
      });

      toast.success('Registration successful!');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: AUTH_ACTIONS.LOGOUT });
    toast.success('Logged out successfully');
  };

  const value = {
    ...state,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
