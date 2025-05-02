import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, Head, usePage } from '@inertiajs/react';
import { BookCheck, BookOpen, Folder, LayoutGrid, ScrollText } from 'lucide-react';
import AppLogo from './app-logo';
import { type SharedData } from '@/types';

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;

    // Default role as empty string, then assign if auth is present
    let role: unknown = '';

    if (auth && auth.user) {
        role = auth.user.role;
        console.log(role);
    }

    let mainNavItems: NavItem[];

    if(role == "examiner")
    {
        mainNavItems = [
            {
                title: 'Dashboard',
                href: '/dashboard/examiner',
                icon: LayoutGrid,
            },
            {
                title: 'Create Exam',
                href: '/exam/create',
                icon: ScrollText,
            },
        ];
    }

    else if(role == "examinee")
    {
        mainNavItems = [
            {
                title: 'Dashboard',
                href: '/dashboard/examinee',
                icon: LayoutGrid,
            },
            {
                title: 'Exams',
                href: '/exams',
                icon: BookCheck,
            },
        ];
    }


    const footerNavItems: NavItem[] = [
        {
            title: 'Repository',
            href: 'https://github.com/laravel/react-starter-kit',
            icon: Folder,
        },
        {
            title: 'Documentation',
            href: 'https://laravel.com/docs/starter-kits',
            icon: BookOpen,
        },
    ];

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            {role === "examiner" ? (
                                <Link href={route('examinerDashboard')} prefetch>
                                    <AppLogo />
                                </Link>
                            ) : role === "examinee" ? (
                                <Link href={route('examineeDashboard')} prefetch>
                                    <AppLogo />
                                </Link>
                            ):(
                                <></>
                            )}
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/*<NavFooter items={footerNavItems} className="mt-auto" />*/}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
