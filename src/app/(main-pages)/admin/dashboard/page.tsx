import AdminDashboard from "~/app/_components/AdminDashboard";

/**
 * Página do Dashboard Admin
 *
 * A proteção é feita pelo middleware.ts, que já verifica:
 * 1. Se o usuário está autenticado
 * 2. Se o role no publicMetadata é "admin"
 *
 * Se chegou aqui, é porque passou pelas verificações do middleware
 */
export default function AdminDashboardPage() {
  return (
    <div>
      <AdminDashboard />
    </div>
  );
}
