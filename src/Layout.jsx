import { AppSidebar } from "./components/Sidebar";
import { SidebarInset, SidebarProvider } from "./components/ui/sidebar";
import { TooltipProvider } from "./components/ui/tooltip";
import { Outlet } from "react-router-dom";


export default function Layout() {
	return (
		<TooltipProvider>
			<SidebarProvider>
				<div className="relative flex min-h-screen w-full bg-background text-foreground overflow-hidden">
					<AppSidebar />
					<SidebarInset className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6">
						<Outlet />
					</SidebarInset>
				</div>
			</SidebarProvider>
		</TooltipProvider>
	);
}
