<?php

namespace App\Http\Controllers;

use App\Models\Answer;
use App\Models\ExamParticipant;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AnswerController extends Controller
{
    /*public function submit(Request $request)
    {
        $participant = ExamParticipant::findOrFail($request->participant_id);
        $score = 0;
        $detailedAnswers = [];

        foreach ($request->answers as $answer) {
            $question = Question::find($answer['question_id']);
            $isCorrect = $question->correct_answer === $answer['answer_text'];

            // Save individual answer
            Answer::create([
                'exam_participant_id' => $participant->id,
                'question_id' => $question->id,
                'answer_text' => $answer['answer_text'],
                'is_correct' => $isCorrect,
            ]);

            if ($isCorrect) $score++;

            // Prepare detailed answer info
            $detailedAnswers[] = [
                'question_text' => $question->question_text,
                'answer_text' => $answer['answer_text'] ?? 'Not Answered',
                'correct_answer' => $question->correct_answer,
            ];
        }

        // Update total score
        $participant->update(['total_score' => $score]);

        // Respond with score and answer breakdown
        return response()->json([
            'score' => $score,
            'answers' => $detailedAnswers,
        ]);
    }*/

    public function submit(Request $request)
    {
        $participant = ExamParticipant::findOrFail($request->participant_id);
        $score = 0;

        $answeredMap = collect($request->answers)->keyBy('question_id');
        $questionIds = $participant->exam->questions->pluck('id');

        $detailedAnswers = [];

        foreach ($participant->exam->questions as $question) {
            $answerText = $answeredMap[$question->id]['answer_text'] ?? null;
            $isCorrect = $question->correct_answer === $answerText;

            // Save only if answered
            if ($answerText !== null) {
                Answer::create([
                    'exam_participant_id' => $participant->id,
                    'question_id' => $question->id,
                    'answer_text' => $answerText,
                    'is_correct' => $isCorrect,
                ]);
            }

            if ($isCorrect) $score++;

            $detailedAnswers[] = [
                'question_text' => $question->question_text,
                'answer_text' => $answerText ?? 'Not Answered',
                'correct_answer' => $question->correct_answer,
            ];
        }

        // Update total score
        $participant->update(['total_score' => $score]);

        return response()->json([
            'score' => $score,
            'answers' => $detailedAnswers,
        ]);

        /*return back()->with([
            'score' => $score,
            'answers' => $detailedAnswers,
        ]);*/
    }

}
