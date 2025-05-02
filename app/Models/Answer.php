<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Answer extends Model
{
    use HasFactory;
    protected $guarded = ['created_at','updated_at'];

    public function participant(): BelongsTo
    {
        return $this->belongsTo(ExamParticipant::class, 'exam_participant_id');
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
