import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { Button } from '@headlessui/react';
import { Inertia } from '@inertiajs/inertia';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Exams',
        href: '/exams',
    },
];

interface Participant {
    user: { id: number };
    total_score: number;
    answers: {
        answer_text: string;
        is_correct: boolean;
        question: {
            question_text: string;
            correct_answer: string;
        };
    }[];

}

interface Exam {
    id: number;
    title: string;
    description: string;
    questions: { id: number }[];
    participants: Participant[];
}

export default function ExamList({ exams }: { exams: Exam[] }) {
    const { auth } = usePage<SharedData>().props;
    const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
    /*Inertia.reload();
    useEffect(() => {
        Inertia.reload({ only: ['exams'] });
    }, []);*/

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="mb-4 text-2xl font-bold">Available Exams</h1>
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {exams.map((exam) => {
                        const participant = exam.participants.find(p => p.user.id === auth.user.id);
                        return (
                            <div key={exam.id} className="rounded-lg border p-4 shadow">
                                <h2 className="text-xl font-semibold">{exam.title}</h2>
                                <p>{exam.description}</p>
                                <p className="text-sm text-gray-600">Total Questions: {exam.questions.length}</p>
                                {participant ? (
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-green-600">Your Score: {participant.total_score}</span>
                                        <button onClick={() => setSelectedParticipant(participant)} className="text-blue-500">
                                            <Eye size={18} />
                                        </button>
                                    </div>
                                ) : (
                                    <Link
                                        href={route('exams.start', exam.id)}
                                        className="mt-2 inline-block text-blue-500 underline"
                                    >
                                        Start Exam
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {selectedParticipant && (
                <div className="fixed inset-0 bg-[#32327aa0] flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                        <h2 className="text-xl font-bold mb-4">Your Answers</h2>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {(selectedParticipant as Participant).answers.map((ans, idx) => (
                                <div key={idx} className="border p-2 rounded">
                                    <p><strong>Q:</strong> {ans.question.question_text}</p>
                                    <p
                                        className={
                                            ans.answer_text === 'Not Answered'
                                                ? 'text-red-500'
                                                : ans.is_correct != 0
                                                    ? 'text-green-600'
                                                    : 'text-red-700'
                                        }
                                    >
                                        <strong>Your Answer:</strong> {ans.answer_text}
                                    </p>

                                    <p><strong>Correct Answer:</strong> {ans.question.correct_answer}</p>
                                </div>
                            ))}

                        </div>
                        <Button
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                            onClick={() => setSelectedParticipant(null)}
                        >
                            Close
                        </Button>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
