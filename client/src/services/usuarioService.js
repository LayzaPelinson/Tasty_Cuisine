/**
 * Serviço de Usuários
 * Gerencia todas as requisições relacionadas a usuários e autenticação
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../config/api';

const ENDPOINT = '/usuario';

/**
 * Registrar novo usuário
 */
export const registerUsuario = async (usuarioData) => {
  try {
    const data = await apiPost(`${ENDPOINT}/registrar`, usuarioData);
    // Salvar token se retornado
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    throw error;
  }
};

/**
 * Login de usuário
 */
export const loginUsuario = async (email, senha) => {
  try {
    const data = await apiPost(`${ENDPOINT}/login`, { email, senha });
    // Salvar token se retornado
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }
    return data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
};

/**
 * Obter dados do usuário logado
 */
export const getUsuarioLogado = async () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      throw new Error('Usuário não autenticado');
    }

    const data = await apiGet(`${ENDPOINT}/perfil`);
    return data;
  } catch (error) {
    console.error('Erro ao obter dados do usuário:', error);
    throw error;
  }
};

/**
 * Obter usuário por ID
 */
export const getUsuarioById = async (id) => {
  try {
    const data = await apiGet(`${ENDPOINT}/${id}`);
    return data;
  } catch (error) {
    console.error(`Erro ao obter usuário ${id}:`, error);
    throw error;
  }
};

/**
 * Atualizar perfil do usuário
 */
export const updatePerfilUsuario = async (usuarioData) => {
  try {
    const data = await apiPut(`${ENDPOINT}/perfil`, usuarioData);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    throw error;
  }
};

/**
 * Atualizar preferências alimentares
 */
export const updatePreferenciasAlimentares = async (preferencias) => {
  try {
    const data = await apiPut(`${ENDPOINT}/preferencias`, preferencias);
    return data;
  } catch (error) {
    console.error('Erro ao atualizar preferências:', error);
    throw error;
  }
};

/**
 * Logout do usuário
 */
export const logoutUsuario = () => {
  localStorage.removeItem('authToken');
};

/**
 * Verificar se usuário está autenticado
 */
export const isAutenticado = () => {
  return !!localStorage.getItem('authToken');
};

/**
 * Obter token de autenticação
 */
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};
