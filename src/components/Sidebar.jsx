import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Users,
  Package,
  BarChart2,
  ClipboardList,
  CalendarDays,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { clearToken } from "@/services/authService";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/" },
  { label: "Menu", icon: UtensilsCrossed, to: "/menu" },
  { label: "Staff", icon: Users, to: "/staff" },
  { label: "Inventory", icon: Package, to: "/inventory" },
  { label: "Reports", icon: BarChart2, to: "/reports" },
  { label: "Order/Table", icon: ClipboardList, to: "/orders" },
  { label: "Reservation", icon: CalendarDays, to: "/reservations" },
];

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearToken();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      {/* Brand */}
      <SidebarHeader className="items-center justify-center py-4">
        <span className="text-lg font-bold tracking-widest text-primary uppercase group-data-[collapsible=icon]:hidden">
          COSYPOS
        </span>
        <span className="hidden text-primary font-bold text-lg group-data-[collapsible=icon]:block">
          C
        </span>
      </SidebarHeader>

      <SidebarSeparator />

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map(({ label, icon: Icon, to }) => (
              <SidebarMenuItem key={to}>
                <SidebarMenuButton asChild tooltip={label}>
                  <NavLink
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      isActive
                        ? "text-primary-foreground bg-primary font-medium"
                        : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      {/* Logout */}
      <SidebarFooter className="py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              tooltip="Logout"
              className="text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
