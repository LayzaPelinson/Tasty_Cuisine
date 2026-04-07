// src/lib/authService.ts - VERSÃO DEBUG
const API_URL = 'http://localhost:8080';

interface LoginResponse {
  success: boolean;
  user?: {
    id: number | string;
    nome: string;
    email: string;
    tipo: 'usuario' | 'chefe';
  };
  error?: string;
}

export const authService = {
  async loginUsuario(nomeDeUsuario: string, senha: string): Promise<LoginResponse> {
    try {
      console.log('🔍 Iniciando login de usuário:', { nomeDeUsuario, senha });

      const response = await fetch(`${API_URL}/usuario/findAll`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        console.error('❌ Erro na resposta:', response.statusText);
        throw new Error('Erro ao conectar com servidor');
      }

      const usuarios = await response.json();
      console.log('📋 Usuários recebidos:', usuarios);
      console.log('📋 Número de usuários:', usuarios.length);

      // Mostrar estrutura dos dados
      if (usuarios.length > 0) {
        console.log('📋 Primeiro usuário:', usuarios[0]);
        console.log('📋 Chaves do primeiro usuário:', Object.keys(usuarios[0]));
      }

      // Procurar usuário - com múltiplas tentativas
      let user = usuarios.find(
        (u: any) => u.nomeDeUsuario === nomeDeUsuario && u.senha === senha
      );

      // Tentar com snake_case
      if (!user) {
        console.log('❌ Não encontrou com camelCase, tentando snake_case...');
        user = usuarios.find(
          (u: any) => u.nome_de_usuario === nomeDeUsuario && u.senha === senha
        );
      }

      // Tentar sem considerar case
      if (!user) {
        console.log('❌ Não encontrou com snake_case, tentando case-insensitive...');
        user = usuarios.find(
          (u: any) =>
            (u.nomeDeUsuario || u.nome_de_usuario)?.toLowerCase() === nomeDeUsuario.toLowerCase() &&
            u.senha === senha
        );
      }

      console.log('🔎 Usuário encontrado:', user);

      if (!user) {
        console.error('❌ Usuário não encontrado na base de dados');
        return { success: false, error: 'Usuário ou senha incorretos' };
      }

      const userData = {
        id: user.codUser || user.cod_user,
        nome: user.nomeDeUsuario || user.nome_de_usuario,
        email: user.gmail,
        tipo: 'usuario' as const
      };

      console.log('✅ Usuário logado com sucesso:', userData);

      return {
        success: true,
        user: userData
      };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  },

  async loginChefe(nomeUsuario: string, senha: string): Promise<LoginResponse> {
    try {
      console.log('🔍 Iniciando login de chef:', { nomeUsuario, senha });

      const response = await fetch(`${API_URL}/chefe/findAll`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('📡 Response status:', response.status);

      if (!response.ok) {
        console.error('❌ Erro na resposta:', response.statusText);
        throw new Error('Erro ao conectar com servidor');
      }

      const chefes = await response.json();
      console.log('📋 Chefes recebidos:', chefes);
      console.log('📋 Número de chefes:', chefes.length);

      // Mostrar estrutura dos dados
      if (chefes.length > 0) {
        console.log('📋 Primeiro chef:', chefes[0]);
        console.log('📋 Chaves do primeiro chef:', Object.keys(chefes[0]));
      }

      // Procurar chef - com múltiplas tentativas
      let chef = chefes.find(
        (c: any) => c.nomeUsuario === nomeUsuario && c.senha === senha
      );

      // Tentar com snake_case
      if (!chef) {
        console.log('❌ Não encontrou com camelCase, tentando snake_case...');
        chef = chefes.find(
          (c: any) => c.nome_usuario === nomeUsuario && c.senha === senha
        );
      }

      // Tentar sem considerar case
      if (!chef) {
        console.log('❌ Não encontrou com snake_case, tentando case-insensitive...');
        chef = chefes.find(
          (c: any) =>
            (c.nomeUsuario || c.nome_usuario)?.toLowerCase() === nomeUsuario.toLowerCase() &&
            c.senha === senha
        );
      }

      console.log('🔎 Chef encontrado:', chef);

      if (!chef) {
        console.error('❌ Chef não encontrado na base de dados');
        return { success: false, error: 'Chef ou senha incorretos' };
      }

      const userData = {
        id: chef.codChefe || chef.cod_chefe,
        nome: chef.nomeUsuario || chef.nome_usuario,
        email: chef.gmail,
        tipo: 'chefe' as const
      };

      console.log('✅ Chef logado com sucesso:', userData);

      return {
        success: true,
        user: userData
      };
    } catch (error) {
      console.error('❌ Erro no login:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  }
};