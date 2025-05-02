<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function gotoExaminerDashboard():Response
    {
        $user = Auth::User();

        return Inertia::render('dashboards/Examiner', [
            'user' => $user,
        ]);
    }

    public function gotoExamineeDashboard():Response
    {
        $user = Auth::User();

        return Inertia::render('dashboards/Examinee', [
            'user' => $user,
        ]);
    }
}
