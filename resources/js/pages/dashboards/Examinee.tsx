import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { FileStack, ScrollText } from 'lucide-react';
import { useEffect } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard/examinee',
    },
];

export default function ExamineeDashboard() {
    useEffect(() => {
        const hasReloaded = sessionStorage.getItem('hasReloaded');
        if (hasReloaded) {
            sessionStorage.removeItem('hasReloaded');
            console.log(hasReloaded);
        }
    }, []);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Examinee Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <Link href={route("exams")}>
                        <div className="block rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <FileStack
                                className="mb-2"
                                color="#32327a"
                                size={36}
                            />
                            <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                                Exams
                            </h5>

                            <p className="font-normal text-gray-700 dark:text-gray-400">
                                See available exams, take part to test your skill.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </AppLayout>
    );
}
