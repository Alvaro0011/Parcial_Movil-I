import React, { createContext, useContext, useState } from 'react';
import { AccountType, UserProfile } from '../types/cargo';
import { MOCK_USER_PARTICULAR, MOCK_USER_EMPRESA } from '../data/mockCargo';

interface AuthContextType {
  user: UserProfile | null;
  accountType: AccountType;
  isAuthenticated: boolean;
  loginWithPhone: (
    phone: string,
    pass: string,
    accountType: AccountType
  ) => { success: boolean; message?: string };
  loginQuickDemo: (accountType: AccountType) => void;
  switchAccountType: () => void;
  logout: () => void;
  updateUserAvatar: (newAvatar: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [particularUser, setParticularUser] = useState<UserProfile>(MOCK_USER_PARTICULAR);
  const [empresaUser, setEmpresaUser] = useState<UserProfile>(MOCK_USER_EMPRESA);
  const [activeAccountType, setActiveAccountType] = useState<AccountType>('PARTICULAR');

  // Ahora inicia en FALSE para que el usuario deba autenticarse obligatoriamente por login
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const user = isAuthenticated
    ? activeAccountType === 'PARTICULAR'
      ? particularUser
      : empresaUser
    : null;

  const loginWithPhone = (
    phone: string,
    pass: string,
    accountType: AccountType
  ) => {
    const cleanPhone = phone.replace(/\D/g, '');

    if (!cleanPhone || cleanPhone.length < 7) {
      return {
        success: false,
        message: 'Ingresa un número de celular válido de 10 dígitos (ej: 300 123 4567).',
      };
    }

    if (!pass || pass.length < 4) {
      return {
        success: false,
        message: 'La contraseña debe tener al menos 4 caracteres (ej: 123456).',
      };
    }

    // Si el teléfono tiene 315 o se eligió Empresa, asignar EMPRESA
    if (cleanPhone.includes('315') || accountType === 'EMPRESA') {
      setActiveAccountType('EMPRESA');
    } else {
      setActiveAccountType('PARTICULAR');
    }

    setIsAuthenticated(true);
    return { success: true };
  };

  const loginQuickDemo = (type: AccountType) => {
    setActiveAccountType(type);
    setIsAuthenticated(true);
  };

  const switchAccountType = () => {
    setActiveAccountType((prev) => (prev === 'PARTICULAR' ? 'EMPRESA' : 'PARTICULAR'));
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  const updateUserAvatar = (newAvatar: string) => {
    if (activeAccountType === 'PARTICULAR') {
      setParticularUser((prev) => ({ ...prev, avatar: newAvatar }));
    } else {
      setEmpresaUser((prev) => ({ ...prev, avatar: newAvatar }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accountType: activeAccountType,
        isAuthenticated,
        loginWithPhone,
        loginQuickDemo,
        switchAccountType,
        logout,
        updateUserAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
