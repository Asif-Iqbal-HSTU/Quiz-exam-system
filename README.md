# Journal App

## Introduction

Quiz-Exam-System is an web application built with Laravel, ReactJS and MySQL. Tailwind CSS is used for better UI.
Here examiners can set quiz exam and make questions for the exams. And the examinees login, take part in the exams, get results immediately and can see the correct answers after submitting the exam script.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Live Link](#live-link)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## Features

- Easy upload questions for exams
- Choosing option between MCQ and Short Answer Questions
- Simple to take part into exams
- User-friendly interface with ReactJS and InertiaJS
- Can revise previous exam questions anytime.

## Requirements

- Laravel
- ReactJS
- InertiaJS
- Composer
- MySQL

## Live Link

- The app is hosted in a server computer. Check this address to run on Live: http://103.7.193.2:75/
- Login as Examiner: Username: examiner & Password: 12341234
- Login as Examinee: Username: examinee & Password: 12341234

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Asif-Iqbal-HSTU/Quiz-exam-system.git
    cd Quiz-exam-system
    ```

2. Install backend dependencies:
    ```bash
    composer install
    ```

3. Install frontend dependencies:
    ```bash
    npm install
    ```

4. Set up environment variables:
    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

5. Configure the `.env` file with your database settings and other environment variables.

6. Run migrations and seed the database:
    ```bash
    php artisan migrate --seed
    ```

7. Start the development server:
    ```bash
    php artisan serve
    ```

8. Start the frontend (from another terminal tab):
    ```bash
    npm run dev
    ```
9. Run the app from browser http://127.0.0.1:8000/

## Usage

### Examiner Login

- **Login**: Examiners can log in securely to the platform.
- **Create Exams**: Examiners can easily create and upload their Question papers.

### Examinee Login

- **Submission**: Examinees can take part into exams easily.
- **Saved Result**: Can see the correct answers of uploaded exam and all the previous exams too.


## Technologies Used

- **Backend**: Laravel
- **Frontend**: ReactJS, InertiaJS
- **Database**: MySQL
- **Styling**: Tailwind CSS
- **Authentication**: Laravel Breeze


## Contact

For any inquiries or feedback, please contact us at:
- Email: asif.iqbal.hstu@gmail.com

## Acknowledgements

- Thanks to [BARC - British American Resource Center](https://hellobarc.com/) for giving me the opportunity to build this web application.
