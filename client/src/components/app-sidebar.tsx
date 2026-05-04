import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  BookUser,
  MapPinCheckInside,
  CircleUser,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthUser } from "@/guards/auth-guard";
import { logout } from "@/modules/auth/auth";
import { Button } from "./ui/button";

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const user = useAuthUser();
  if (user?.roleId === 1){
    return (
       <Sidebar>
      <SidebarHeader>
        <div className="space-y-1 px-2 py-1">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-sidebar-foreground/70">Workspace shell</p>
        </div>
        <Button className="w-full mt-2" variant="destructive" onClick={handleLogout}>Logout</Button>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link to="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/employee")}>
                <Link to="/employee">
                  <User />
                  <span>Karyawan</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/absent") && !pathname.startsWith("/absent/my")}>
                <Link to="/absent">
                  <BookUser />
                  <span>Absen</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/absent/my")}>
                <Link to="/absent/my">
                  <MapPinCheckInside />
                  <span>Absen Ku</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/role")}>
                <Link to="/role">
                  <CircleUser />
                  <span>Role</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/70">
          v0.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
    )
  }
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="space-y-1 px-2 py-1">
          <p className="text-sm font-semibold">{user?.name}</p>
          <p className="text-xs text-sidebar-foreground/70">Workspace shell</p>
        </div>
        <Button className="w-full mt-2" variant="destructive" onClick={handleLogout}>Logout</Button>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname === "/"}>
                <Link to="/">
                  <LayoutDashboard />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith("/absent/my")}>
                <Link to="/absent/my">
                  <MapPinCheckInside />
                  <span>Absen Ku</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 py-1 text-xs text-sidebar-foreground/70">
          v0.0.0
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
