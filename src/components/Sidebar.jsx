import { NavLink } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar() {
	return (
		<Sidebar collapsible="icon" className={"group-data-[state=collapsed]:w-8"}>
			<SidebarContent
				className={"group-data-[state=collapsed]:w-8 overflow-hidden"}
			>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem className="p-0 m-0">
							<SidebarMenuButton
								asChild
								className={"rounded-none h-10 px-2.5 py-3"}
							>
								<NavLink to={"/"} className="text-red-400">Home</NavLink>
							</SidebarMenuButton>
							<SidebarMenuButton
								asChild
								className={"rounded-none h-10 px-2.5 py-3"}
							>
								<NavLink to={"/about"} className="text-red-400">About</NavLink>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}
