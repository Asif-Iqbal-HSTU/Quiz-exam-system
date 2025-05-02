import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Create Exam',
        href: '/exam/create',
    },
];
interface Question {
    type: 'mcq' | 'short';
    question_text: string;
    options?: string[]; // Only for MCQ
    correct_answer: string;
}

export default function ExamBuilder() {
    const { data, setData, post, errors } = useForm({
        title: '',
        description: '',
        questions: [] as Question[],
    });

    const addQuestion = () => {
        setData('questions', [
            ...data.questions,
            { type: 'mcq', question_text: '', options: ['', '', '', ''], correct_answer: '' },
        ]);
    };

    const updateQuestion = (index: number, field: keyof Question, value: any) => {
        const updatedQuestions = [...data.questions];
        if (field === 'options') {
            updatedQuestions[index].options = value;
        } else {
            (updatedQuestions[index] as any)[field] = value;
        }
        setData('questions', updatedQuestions);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('exams.store'));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border md:min-h-min">
                    <div className="p-5">
                        <h1 className="text-2xl font-bold mb-4">Create New Exam</h1>
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="title">Exam Title</Label>
                                    <Input
                                        type="text"
                                        placeholder="Exam Title"
                                        value={data.title}
                                        onChange={(e) => setData('title', e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description">Exam Description</Label>
                                    <Textarea
                                        type="text"
                                        placeholder="Exam Description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                    />
                                </div>
                                {data.questions.map((question, index) => (
                                    <div key={index} className="mb-6 p-4 border rounded">
                                        <div className="grid gap-6">
                                            <div className="grid gap-2">
                                                <Label className="block font-semibold mb-1">Question {index + 1}</Label>
                                                <Textarea
                                                    type="text"
                                                    placeholder="Question Text"
                                                    value={question.question_text}
                                                    onChange={(e) => updateQuestion(index, 'question_text', e.target.value)}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label className="block font-semibold mb-1">Select Question Type</Label>
                                                <select
                                                    className="border rounded-md p-2 mb-2"
                                                    value={question.type}
                                                    onChange={(e) => {
                                                        const newType = e.target.value as 'mcq' | 'short';
                                                        const updated = { ...question, type: newType };
                                                        if (newType === 'mcq' && !question.options) {
                                                            updated.options = ['', '', '', ''];
                                                        }
                                                        updateQuestion(index, 'type', newType);
                                                    }}
                                                >
                                                    <option value="mcq">Multiple Choice</option>
                                                    <option value="short">Short Answer</option>
                                                </select>
                                            </div>



                                            {question.type === 'mcq' && (
                                                <>
                                                    {question.options?.map((option, optIdx) => (
                                                        <Input
                                                            key={optIdx}
                                                            placeholder={`Option ${optIdx + 1}`}
                                                            value={option}
                                                            onChange={(e) => {
                                                                const newOptions = [...(question.options || [])];
                                                                newOptions[optIdx] = e.target.value;
                                                                updateQuestion(index, 'options', newOptions);
                                                            }}
                                                        />
                                                    ))}
                                                </>
                                            )}

                                            <div className="grid gap-2">
                                                <Label htmlFor="correct_answer">Correct Answer</Label>
                                                <Input
                                                    placeholder="Correct Answer"
                                                    value={question.correct_answer}
                                                    onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <Button type="button" onClick={addQuestion} className="bg-[#32327a] text-white px-4 py-2 rounded mr-2">
                                    Add Question
                                </Button>
                                <Button type="submit" className="bg-[#bb141b] text-white px-4 py-2 rounded">
                                    Save Exam
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
