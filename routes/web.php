<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExamController;
use App\Http\Middleware\ExamineeMiddleware;
use App\Http\Middleware\ExaminerMiddleware;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

/*Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});*/

Route::get('/dashboard/examiner', [DashboardController::class, 'gotoExaminerDashboard'])
    ->middleware(['auth', 'verified'])->name('examinerDashboard')->middleware(ExaminerMiddleware::class);

Route::get('/dashboard/examinee', [DashboardController::class, 'gotoExamineeDashboard'])
    ->middleware(['auth', 'verified'])->name('examineeDashboard')->middleware(ExamineeMiddleware::class);


Route::middleware(['auth', 'verified'])->group(function () {

    Route::middleware(ExaminerMiddleware::class)->group(function () {
        Route::get('/exam/create', [ExamController::class, 'create'])->name('question.creation');
        Route::post('/exam/store', [ExamController::class, 'store'])->name('exams.store');

    });

    Route::middleware(ExamineeMiddleware::class)->group(function () {
        Route::get('/exams', [ExamController::class, 'index'])->name('exams');
        Route::get('/exam/start/{id}', [\App\Http\Controllers\ExamParticipantController::class, 'start'])->name('exams.start');
        Route::post('/exam/submit', [\App\Http\Controllers\AnswerController::class, 'submit'])->name('exam.submit');
    });
});

/*Route::get('/exam/create', [ExamController::class, 'create'])->name('question.creation')->middleware(ExaminerMiddleware::class);
Route::post('/exam/store', [ExamController::class, 'store'])->name('exams.store')->middleware(ExaminerMiddleware::class);*/

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
