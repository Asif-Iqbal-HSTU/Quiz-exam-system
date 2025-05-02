<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ExamController extends Controller
{
    public function index()
    {
        $exams = Exam::with(
            'questions',
            'participants',
            'participants.user',
            'participants.answers.question'
        )->get();

        foreach ($exams as $exam) {
            foreach ($exam->participants as $participant) {
                $answersByQuestionId = $participant->answers->keyBy('question_id');

                $participant->setRelation('answers', $exam->questions->map(function ($question) use ($answersByQuestionId) {
                    $answer = $answersByQuestionId->get($question->id);

                    return (object) [
                        'question' => [
                            'question_text' => $question->question_text,
                            'correct_answer' => $question->correct_answer,
                        ],
                        'answer_text' => $answer?->answer_text ?? 'Not Answered',
                        'is_correct' => $answer?->is_correct ?? false,
                    ];
                }));
            }
        }

        return Inertia::render('examinee/ExamList', [
            'exams' => $exams,
        ]);
    }

    public function create()
    {
        return Inertia::render('examiner/ExamBuilder');
    }

    // Store the exam with questions
    public function store(Request $request)
    {

        $user = Auth::User();

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'questions' => 'required|array|min:1',
            'questions.*.type' => 'required|in:mcq,short',
            'questions.*.question_text' => 'required|string',
            'questions.*.correct_answer' => 'required|string',
            'questions.*.options' => 'nullable|array',
            'questions.*.options.*' => 'nullable|string',
        ]);

        $exam = Exam::create([
            'user_id' => $user->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? '',
            // Add more fields as necessary (e.g., user_id)
        ]);

        foreach ($validated['questions'] as $question) {
            $exam->questions()->create([
                'type' => $question['type'],
                'question_text' => $question['question_text'],
                'correct_answer' => $question['correct_answer'],
                'options' => $question['type'] === 'mcq' ? json_encode($question['options']) : null,
            ]);
        }

        return redirect()->route('examinerDashboard')->with('success', 'Exam created successfully!');
    }

}
