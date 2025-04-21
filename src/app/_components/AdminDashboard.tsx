'use client';

import { useState } from "react";
import { api } from "~/trpc/react";
import { format } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import Link from "next/link";
import Head from "next/head";

const barberNames: Record<string, string> = {
  "1": "Igor",
  "2": "Jhélita",
  "3": "Eliel",
};

export default function AdminDashboard() {
  const { data = [] } = api.appointments.list.useQuery();

  const utils = api.useUtils();

const updateStatus = api.appointments.updateStatus.useMutation({
  onSuccess: () => {
    utils.appointments.list.invalidate(); // refetch lista após sucesso
  },
  onError: (err) => {
    console.error("Erro ao atualizar status:", err);
    alert("Erro ao atualizar status do agendamento.");
  }
});

const handleUpdateStatus = (id: number, status: "confirmado" | "cancelado") => {
  updateStatus.mutate({ id, status });
};

  const [filters, setFilters] = useState({
    date: "",
    status: "Todos",
    barber: "Todos",
  });

  const appointments = data
    .map((item) => ({
      ...item,
      id: String(item.id),
      name: barberNames[item.barber_id] ?? item.barber_id,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const filtered = appointments.filter((a) => {
    const matchDate = filters.date ? format(new Date(a.date), "yyyy-MM-dd") === filters.date : true;
    const matchStatus = filters.status === "Todos" || a.status === filters.status.toLowerCase();
    const matchBarber = filters.barber === "Todos" || a.barber_id === filters.barber;
    return matchDate && matchStatus && matchBarber;
  });

  const total = filtered.length;
  const confirmados = filtered.filter((a) => a.status === "confirmado").length;
  const cancelados = filtered.filter((a) => a.status === "cancelado").length;
  const valorTotal = filtered
    .filter((a) => a.status === "confirmado")
    .reduce((acc, cur) => {
      const priceValue = cur.price ? parseFloat(String(cur.price)) : 0;
      return acc + priceValue;
    }, 0);

  return (
    <div className="min-h-screen flex flex-col bg-zinc-900 text-white">

      <Head>
        <title>Dashboard de Agendamentos</title>
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-purple-600 to-pink-500 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link href="/">
            <h1 className="text-2xl font-bold cursor-pointer">IGOR BARBER</h1>
          </Link>
        </div>
      </header>

      {/* Conteúdo principal */}
      <main className="flex-grow p-8">
      <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Dashboard de Agendamentos
        </h2>
        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total de Agendamentos" icon="📅" value={total} />
          <StatCard title="Confirmados" icon="✅" value={confirmados} />
          <StatCard title="Cancelados" icon="❌" value={cancelados} />
          <StatCard title="Valor Total" icon="💰" value={`R$ ${valorTotal.toFixed(2)}`} />
        </div>

        {/* Filtros */}
        <div className="bg-zinc-800 p-4 rounded-lg mb-4">
          <h2 className="text-lg font-semibold text-purple-300 mb-4">Filtros</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              type="date"
              className="bg-zinc-700 text-white"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
            <Select
              value={filters.status}
              onValueChange={(value) => setFilters({ ...filters, status: value })}
            >
              <SelectTrigger className="bg-zinc-700 text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {["Todos", "Confirmado", "Cancelado", "Pendente"].map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.barber}
              onValueChange={(value) => setFilters({ ...filters, barber: value })}
            >
              <SelectTrigger className="bg-zinc-700 text-white">
                <SelectValue placeholder="Barbeiro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Todos">Todos</SelectItem>
                {Object.entries(barberNames).map(([id, name]) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-zinc-800 text-left">
            <thead>
              <tr className="text-purple-300 border-b border-zinc-700">
                <th className="p-4">Cliente</th>
                <th className="p-4">Telefone</th>
                <th className="p-4">Data</th>
                <th className="p-4">Hora</th>
                <th className="p-4">Serviço</th>
                <th className="p-4">Valor</th>
                <th className="p-4">Barbeiro</th>
                <th className="p-4">Status</th>
                <th className="p-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-zinc-700 transition-colors">
                  <td className="p-4">{a.client_name}</td>
                  <td className="p-4">{a.phone}</td>
                  <td className="p-4">{format(new Date(a.date), "dd/MM/yyyy", { locale: ptBR })}</td>
                  <td className="p-4">{a.time}</td>
                  <td className="p-4">{a.service}</td>
                  <td className="p-4">R$ {a.price}</td>
                  <td className="p-4">{a.name}</td>
                  <td className="p-4">
                    <Badge
                      className={
                        a.status === "cancelado"
                          ? "bg-red-500"
                          : a.status === "confirmado"
                          ? "bg-green-500"
                          : "bg-yellow-500"
                      }
                    >
                      {a.status}
                    </Badge>
                  </td>
                  <td className="p-4 space-x-2">
  {a.status !== "confirmado" && (
    <Button
      variant="success"
      size="sm"
      onClick={() => handleUpdateStatus(parseInt(a.id), "confirmado")}
    >
      Confirmar
    </Button>
  )}
  {a.status !== "cancelado" && (
    <Button
      variant="destructive"
      size="sm"
      onClick={() => handleUpdateStatus(parseInt(a.id), "cancelado")}
    >
      Cancelar
    </Button>
  )}
  {/* <Button variant="secondary" size="sm" onClick={() => alert(`Editar agendamento ${a.id}`)}>
    Editar
  </Button> */}
</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black py-6">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Igor Barber - Dashboard do Administrador</p>
        </div>
      </footer>
    </div>
  );
}

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) => (
  <div className="bg-zinc-800 p-4 rounded-lg text-center border border-zinc-700">
    <h2 className="text-md text-zinc-300 mb-2">{title}</h2>
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-2xl mt-1">{icon}</div>
  </div>
);
