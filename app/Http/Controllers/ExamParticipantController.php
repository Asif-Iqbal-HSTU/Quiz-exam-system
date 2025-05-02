<?php

namespace App\Http\Controllers;

use App\Models\Exam;
use App\Models\ExamParticipant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExamParticipantController extends Controller
{
    public function start($examId)
    {
        $participant = ExamParticipant::firstOrCreate([
            'user_id' => auth()->id(),
            'exam_id' => $examId,
        ]);

        $exam = Exam::with('questions')->findOrFail($examId);

        // Decode options JSON string to array
        $exam->questions->transform(function ($q) {
            $q->options = is_string($q->options) ? json_decode($q->options) : $q->options;
            return $q;
        });

        return Inertia::render('examinee/ExamPage', [
            'exam' => $exam,
            'participant_id' => $participant->id,
        ]);
    }

}
