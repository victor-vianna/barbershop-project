// pages/admin/dashboard.jsx
"use client"

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Calendar, Clock, Scissors, User, Filter, PieChart } from 'lucide-react';

export default function AdminDashboard() {
  // Estados para gerenciar os dados da página
  const [dataFiltro, setDataFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('todos');
  const [barbeiroFiltro, setBarbeiroFiltro] = useState('todos');
  
  // Dados simulados de agendamentos
  const [agendamentos, setAgendamentos] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      telefone: '(11) 98765-4321',
      data: '20/04/2025',
      hora: '14:30',
      servico: 'Corte de Cabelo',
      valor: 45.00,
      barbeiro: 'Carlos',
      status: 'confirmado'
    },
    {
      id: 2,
      cliente: 'Pedro Oliveira',
      telefone: '(11) 91234-5678',
      data: '20/04/2025',
      hora: '10:00',
      servico: 'Barba',
      valor: 30.00,
      barbeiro: 'Marcos',
      status: 'confirmado'
    },
    {
      id: 3,
      cliente: 'André Costa',
      telefone: '(11) 95555-9999',
      data: '20/04/2025',
      hora: '16:15',
      servico: 'Corte e Barba',
      valor: 70.00,
      barbeiro: 'Felipe',
      status: 'confirmado'
    },
    {
      id: 4,
      cliente: 'Lucas Mendes',
      telefone: '(11) 93333-2222',
      data: '21/04/2025',
      hora: '09:30',
      servico: 'Corte de Cabelo',
      valor: 45.00,
      barbeiro: 'Carlos',
      status: 'confirmado'
    },
    {
      id: 5,
      cliente: 'Gabriel Santos',
      telefone: '(11) 94444-1111',
      data: '21/04/2025',
      hora: '15:00',
      servico: 'Corte e Barba',
      valor: 70.00,
      barbeiro: 'Marcos',
      status: 'cancelado'
    }
  ]);

  // Lista de barbeiros
  const barbeiros = ['Carlos', 'Marcos', 'Felipe'];

  // Função para alterar o status do agendamento
  const alterarStatus = (id: any, novoStatus: any) => {
    setAgendamentos(
      agendamentos.map(agendamento => 
        agendamento.id === id 
          ? { ...agendamento, status: novoStatus } 
          : agendamento
      )
    );
  };

  // Função para adicionar novo agendamento
  const adicionarAgendamento = () => {
    // Aqui você implementaria a lógica para abrir um formulário ou modal
    alert('Abrir formulário para novo agendamento');
  };

  // Função para filtrar os agendamentos
  const agendamentosFiltrados = agendamentos.filter(agendamento => {
    // Filtro por data
    const passaFiltroPorData = !dataFiltro || agendamento.data === dataFiltro;
    
    // Filtro por status
    const passaFiltroPorStatus = statusFiltro === 'todos' || agendamento.status === statusFiltro;
    
    // Filtro por barbeiro
    const passaFiltroPorBarbeiro = barbeiroFiltro === 'todos' || agendamento.barbeiro === barbeiroFiltro;
    
    return passaFiltroPorData && passaFiltroPorStatus && passaFiltroPorBarbeiro;
  });

  // Cálculo de dados para o resumo
  const totalAgendamentos = agendamentosFiltrados.length;
  const agendamentosConfirmados = agendamentosFiltrados.filter(a => a.status === 'confirmado').length;
  const agendamentosCancelados = agendamentosFiltrados.filter(a => a.status === 'cancelado').length;
  const valorTotal = agendamentosFiltrados
    .filter(a => a.status === 'confirmado')
    .reduce((total, atual) => total + atual.valor, 0);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Head>
        <title>Administração | Igor Barber</title>
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 py-4">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link href="/">
              <h1 className="text-2xl font-bold cursor-pointer">IGOR BARBER</h1>
            </Link>
            <div className="hidden md:block">
              <span className="font-medium">Painel de Administração</span>
            </div>
            <nav>
              <Link href="/" className="px-4 py-2 hover:underline">
                Voltar ao Site
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Dashboard de Agendamentos
        </h2>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total de Agendamentos</h3>
              <Calendar className="text-purple-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{totalAgendamentos}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Confirmados</h3>
              <Clock className="text-green-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{agendamentosConfirmados}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Cancelados</h3>
              <User className="text-red-500" size={24} />
            </div>
            <p className="text-3xl font-bold">{agendamentosCancelados}</p>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Valor Total</h3>
              <PieChart className="text-pink-500" size={24} />
            </div>
            <p className="text-3xl font-bold">R$ {valorTotal.toFixed(2)}</p>
          </div>
        </div>

        {/* Filtros e Ações */}
        <div className="bg-gray-800 rounded-lg p-6 shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold flex items-center">
              <Filter size={20} className="mr-2 text-purple-500" />
              Filtros
            </h3>
            <button 
              onClick={adicionarAgendamento}
              className="bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white px-4 py-2 rounded-lg transition duration-300"
            >
              Novo Agendamento
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Data</label>
              <input
                type="text"
                placeholder="DD/MM/AAAA"
                value={dataFiltro}
                onChange={(e) => setDataFiltro(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={statusFiltro}
                onChange={(e) => setStatusFiltro(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todos">Todos</option>
                <option value="confirmado">Confirmado</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Barbeiro</label>
              <select
                value={barbeiroFiltro}
                onChange={(e) => setBarbeiroFiltro(e.target.value)}
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="todos">Todos</option>
                {barbeiros.map((barbeiro, index) => (
                  <option key={index} value={barbeiro}>{barbeiro}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tabela de Agendamentos */}
        <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left font-semibold">Cliente</th>
                  <th className="py-3 px-4 text-left font-semibold">Telefone</th>
                  <th className="py-3 px-4 text-left font-semibold">Data</th>
                  <th className="py-3 px-4 text-left font-semibold">Hora</th>
                  <th className="py-3 px-4 text-left font-semibold">Serviço</th>
                  <th className="py-3 px-4 text-left font-semibold">Valor</th>
                  <th className="py-3 px-4 text-left font-semibold">Barbeiro</th>
                  <th className="py-3 px-4 text-left font-semibold">Status</th>
                  <th className="py-3 px-4 text-left font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {agendamentosFiltrados.length > 0 ? (
                  agendamentosFiltrados.map((agendamento) => (
                    <tr key={agendamento.id} className="border-b border-gray-700 hover:bg-gray-700">
                      <td className="py-3 px-4">{agendamento.cliente}</td>
                      <td className="py-3 px-4">{agendamento.telefone}</td>
                      <td className="py-3 px-4">{agendamento.data}</td>
                      <td className="py-3 px-4">{agendamento.hora}</td>
                      <td className="py-3 px-4">{agendamento.servico}</td>
                      <td className="py-3 px-4">R$ {agendamento.valor.toFixed(2)}</td>
                      <td className="py-3 px-4">{agendamento.barbeiro}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2 py-1 rounded text-xs ${
                          agendamento.status === 'confirmado' 
                            ? 'bg-green-500' 
                            : 'bg-red-500'
                        }`}>
                          {agendamento.status === 'confirmado' ? 'Confirmado' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {agendamento.status === 'confirmado' ? (
                          <button
                            onClick={() => alterarStatus(agendamento.id, 'cancelado')}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded text-sm mr-2"
                          >
                            Cancelar
                          </button>
                        ) : (
                          <button
                            onClick={() => alterarStatus(agendamento.id, 'confirmado')}
                            className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded text-sm mr-2"
                          >
                            Confirmar
                          </button>
                        )}
                        <button
                          className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='9' className="py-8 text-center text-gray-400">
                      Nenhum agendamento encontrado com os filtros aplicados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Igor Barber - Painel Administrativo</p>
        </div>
      </footer>
    </div>
  );
}