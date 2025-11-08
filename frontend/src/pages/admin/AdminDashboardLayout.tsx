import { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  TreePine,
  LogOut,
  Home,
  DollarSign,
  Building2,
  HeartHandshake
  , LogIn, UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

const sidebarItems = [
  { icon: Home, label: 'Overview', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/dashboard/users' },
  { icon: DollarSign, label: 'Donations', path: '/admin/dashboard/donations' },
  { icon: MessageSquare, label: 'Contacts', path: '/admin/dashboard/contacts' },
  { icon: Building2, label: 'CSR Inquiries', path: '/admin/dashboard/csr' },
  { icon: TreePine, label: 'Trees', path: '/admin/dashboard/trees' },
  { icon: HeartHandshake, label: 'Volunteers', path: '/admin/dashboard/volunteers' },
  { icon: LogIn, label: 'Logins', path: '/admin/dashboard/logins' },
  { icon: UserPlus, label: 'Signups', path: '/admin/dashboard/signups' },
];

export function AdminDashboardLayout() {
  const navigate = useNavigate();
  const [activePath, setActivePath] = useState(window.location.pathname);

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuth');
    navigate('/admin/login');
  };

  const handleNavigation = (path: string) => {
    setActivePath(path);
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: 0 }}
        className="w-64 bg-white shadow-lg"
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>
          <Separator />
          <ScrollArea className="flex-1">
            <nav className="p-4 space-y-2">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.path}
                    variant={activePath === item.path ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </ScrollArea>
          <Separator />
          <div className="p-4">
            <Button
              variant="destructive"
              className="w-full justify-start gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}