import { useEffect, useState } from 'react';
import { router, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Available Exams',
        href: '/exams',
    },
];

interface Question {
    id: number;
    question_text: string;
    type: 'mcq' | 'short';
    options?: string[];
    correct_answer?: string;
}

interface ExamPageProps {
    exam: { id: number; title: string; questions: Question[] };
    participant_id: number;
}

export default function ExamPage({ exam, participant_id }: ExamPageProps) {
    /*useEffect(() => {
        window.location.reload();
    }, []);*/

    useEffect(() => {
        const intervalId = setInterval(() => {
            window.location.reload();
        }, 660000); // Reload every  seconds

        console.log("Reloaded");
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, []);

    const { data, setData, post } = useForm({
        participant_id,
        answers: [] as { question_id: number; answer_text: string }[],
    });

    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState<number | null>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [detailedAnswers, setDetailedAnswers] = useState<any[]>([]);
    // const [showInstructions, setShowInstructions] = useState(true);
    const [hasStarted, setHasStarted] = useState(false);
    const [showPreExamModal, setShowPreExamModal] = useState(true);


    console.log({ showResult, showDetails, score, detailedAnswers });

    const [csrfToken, setCsrfToken] = useState<string | null>(null);

    useEffect(() => {
        // window.location.reload();
        const token = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
        setCsrfToken(token);
    }, []);

    /*useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    alert('Time expired! Auto-submitting...');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);*/

    useEffect(() => {
        if (!hasStarted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    alert('Time expired! Auto-submitting...');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [hasStarted]);

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!showResult && hasStarted) {
                e.preventDefault();
                e.returnValue = '';
                handleSubmit(); // auto-submit
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasStarted, showResult]);


    const handleAnswer = (qid: number, val: string) => {
        setData(prev => {
            const exists = prev.answers.find(a => a.question_id === qid);
            const updated = exists
                ? prev.answers.map(a => a.question_id === qid ? { ...a, answer_text: val } : a)
                : [...prev.answers, { question_id: qid, answer_text: val }];
            return { ...prev, answers: updated };
        });
    };


    const handleSubmit = async () => {
        if (!csrfToken) {
            alert('CSRF token missing. Please reload.');
            return;
        }

        try {
            const response = await fetch(route('exam.submit'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                const resData = await response.json();
                setScore(resData.score);
                setDetailedAnswers(resData.answers);
                setShowResult(true);
            } else {
                alert("Submission failed.");
            }
        } catch (error) {
            console.error(error);
            alert("Error submitting exam.");
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Exam" />
            <div className="p-6">
                <h1 className="text-xl font-bold mb-4">{exam.title}</h1>
                {hasStarted && (
                    <div className="mb-4 text-red-600 font-semibold">
                        Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                )}
                {hasStarted && (
                    <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
                        {exam.questions.map((q, index) => (
                            <div key={q.id} className="mb-4">
                                <Label className="font-semibold text-lg">{index+1}.  {q.question_text}</Label>
                                {q.type === 'mcq' ? (
                                    (q.options || []).map((opt, idx) => (
                                        <div key={idx}>
                                            <label>
                                                <input
                                                    type="radio"
                                                    name={`q${q.id}`}
                                                    className="text-xl"
                                                    value={opt}
                                                    onChange={() => handleAnswer(q.id, opt)}
                                                /> {opt}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <Input
                                        type="text"
                                        className="border p-2 w-full mt-2"
                                        placeholder="Enter your answer"
                                        onChange={(e) => handleAnswer(q.id, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}
                        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
                    </form>
                )}

                {showResult && (
                    <div className="fixed inset-0 bg-[#32327aa0] flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                            <h2 className="text-xl font-bold mb-4">Submission Successful!</h2>
                            <p className="mb-4">You scored: <strong>{score}</strong></p>
                            <button
                                className="bg-green-600 text-white px-4 py-2 rounded mr-2"
                                onClick={() => setShowDetails(true)}
                            >
                                See Correct Answers
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded"
                                onClick={() => router.visit(route('exams'))}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}

                {showDetails && (
                    <div className="fixed inset-0 bg-[#32327aa0] flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
                            <h2 className="text-xl font-bold mb-4">Answer Details</h2>
                            {detailedAnswers.map((ans, idx) => (
                                <div key={idx} className="border p-2 mb-2 rounded">
                                    <p><strong>Q:</strong> {ans.question_text}</p>
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
                                    <p><strong>Correct Answer:</strong> {ans.correct_answer}</p>
                                </div>
                            ))}
                            <button
                                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={() => router.visit(route('exams'))}
                            >
                                Close Details
                            </button>
                        </div>
                    </div>
                )}

                {/*{showResult && (
                    <div className="mt-6 p-4 border rounded shadow bg-gray-50">
                        <h2 className="text-lg font-bold mb-2">Your Score: {score}</h2>

                        <button
                            className="mb-4 text-blue-600 underline"
                            onClick={() => setShowDetails(prev => !prev)}
                        >
                            {showDetails ? 'Hide Details' : 'Show Answer Details'}
                        </button>

                        {showDetails && (
                            <div className="space-y-4">
                                {detailedAnswers.map((ans, idx) => (
                                    <div key={idx} className="border p-3 rounded bg-white">
                                        <p><strong>Q:</strong> {ans.question_text}</p>
                                        <p className={ans.answer_text === 'Not Answered' ? 'text-red-600' : ''}>
                                            <strong>Your Answer:</strong> {ans.answer_text}
                                        </p>
                                        <p><strong>Correct Answer:</strong> {ans.correct_answer}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}*/}

                {/*{showInstructions && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                            <h2 className="text-xl font-bold mb-4">Exam Instructions</h2>
                            <ul className="list-disc pl-6 mb-4 text-left">
                                <li>Do not reload or exit the page. It will automatically submit the exam.</li>
                                <li>If time runs out, your answers will be auto-submitted.</li>
                            </ul>
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                                onClick={() => setShowInstructions(false)}
                            >
                                Start Exam
                            </button>
                        </div>
                    </div>
                )}*/}

                {showPreExamModal && (
                    <div className="fixed inset-0 flex bg-[#32327aa0] shadow-sm items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                            <h2 className="text-xl font-bold mb-4">Before You Begin</h2>
                            <ul className="list-disc list-inside mb-4 text-gray-700">
                                <li>If you reload or exit the page, your exam will be auto-submitted.</li>
                                <li>If time runs out, your exam will also be auto-submitted.</li>
                            </ul>
                            <button
                                onClick={() => {
                                    setHasStarted(true);
                                    setShowPreExamModal(false);
                                }}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                Start Exam
                            </button>
                        </div>
                    </div>
                )}



            </div>
        </AppLayout>
    );
}
