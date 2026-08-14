# Maventic Insight

Build a very simple but fully working MVP called **"Maventic Assess"**.

The goal is to demonstrate one core idea:

> A student can write pseudocode/thought process and imperfect code, and an AI evaluates the solution based on reasoning and gives a REAL score out of 100.

Keep this MVP extremely simple so it can be completed within limited Lovable credits.

Do NOT build a complex enterprise system.

==================================================
TECH STACK
==========

Use:

* React / TypeScript
* Tailwind CSS
* Supabase
* Groq API
* Simple textarea-based editor

Do NOT use Monaco Editor.

The code editor can simply be a large textarea styled like a code editor.

==================================================
LOGIN
=====

Do NOT build real authentication for this MVP.

Use a simple hardcoded login screen.

Admin credentials:

Email:
[admin@maventic.com](mailto:admin@maventic.com)

Password:
admin123

Student credentials:

Email:
[student@maventic.com](mailto:student@maventic.com)

Password:
student123

After login:

Admin → Admin Dashboard

Student → Student Dashboard

==================================================
STUDENT DASHBOARD
=================

Show one hardcoded test:

Maventic DSA Screening Test

College:
Oriental Institute of Science and Technology

Duration:
60 Minutes

Questions:
1

Passing Score:
70

Button:

[ Start Test ]

==================================================
QUESTION
========

Use ONE hardcoded DSA question.

Question:

"Given an array of integers and a target integer, find two numbers whose sum equals the target. Return their indices."

Expected approach:

HashMap

Difficulty:

Easy

Do not create a question management system.

The question can simply be stored in the code for this MVP.

==================================================
TEST SCREEN
===========

Create a simple clean test interface.

Show:

Question

Problem Description

Then two editors:

---

## THOUGHT PROCESS / PSEUDOCODE

Large textarea.

Placeholder:

"Explain how you would solve this problem..."

---

## CODE

Large textarea.

Placeholder:

"Write your solution here..."

Also provide:

Language:

JavaScript
Python
Java
C++
C

Use a simple dropdown.

No code execution.

No compiler.

No test cases.

No Run button.

The purpose is only to capture what the candidate thinks and writes.

==================================================
SUBMIT
======

Button:

[ Submit Solution ]

Before submitting show confirmation:

"Are you sure? You cannot edit your solution after submission."

After submission:

* Disable the editors
* Send the question + expected approach + pseudocode + code + language to Groq
* Wait for AI evaluation
* Show a loading state:

"AI is evaluating your solution..."

==================================================
GROQ AI
=======

DO NOT USE OPENAI.

Use Groq.

Endpoint:

https://api.groq.com/openai/v1/chat/completions

Model:

llama-3.3-70b-versatile

Use environment variable:

GROQ_API_KEY

IMPORTANT:

Never expose GROQ_API_KEY in frontend code.

Call Groq only from a secure server-side function/API route.

==================================================
AI EVALUATION
=============

The AI should evaluate the student's actual submission.

Do NOT hardcode the score.

Do NOT create fake AI responses.

Send:

Question
Expected Approach
Student Pseudocode
Student Code
Programming Language

Evaluate using:

Understanding: 20
Approach: 20
Pseudocode / Thought Process: 20
Code Logic: 20
Correctness: 10
Complexity: 5
Edge Cases: 5

Total = 100

Important evaluation rule:

The purpose of this platform is NOT to check whether the code compiles perfectly.

Minor syntax errors should NOT heavily reduce the score if the algorithm and reasoning are correct.

For example:

* missing semicolon
* minor syntax error
* small typo
* incomplete syntax

should not cause a logically correct solution to receive a very low score.

However:

* wrong algorithm
* incorrect reasoning
* fundamental logical errors

should significantly reduce the score.

==================================================
AI RESPONSE
===========

Ask Groq to return ONLY JSON:

{
"understanding": 18,
"approach": 19,
"pseudocode": 18,
"logic": 17,
"correctness": 9,
"complexity": 5,
"edge_cases": 4,
"total": 90,
"recommendation": "SHORTLISTED",
"feedback": "Strong understanding and correct approach.",
"strengths": [
"Correct HashMap approach",
"Good reasoning"
],
"weaknesses": [
"Missed one edge case"
]
}

The application must calculate/verify the total score from the returned criteria rather than trusting a hardcoded score.

==================================================
RESULT PAGE
===========

After AI evaluation show:

YOUR RESULT

Score:

90 / 100

Status:

SHORTLISTED

if score >= 70

otherwise:

NOT SHORTLISTED

Show the complete breakdown:

Understanding
18 / 20

Approach
19 / 20

Pseudocode
18 / 20

Code Logic
17 / 20

Correctness
9 / 10

Complexity
5 / 5

Edge Cases
4 / 5

Total
90 / 100

Then show:

AI Feedback

Strengths

Weaknesses

==================================================
ADMIN DASHBOARD
===============

Create a very simple admin dashboard.

Show:

Maventic DSA Screening Test

Candidate Results

Student Name
Score
Status

The demo student should appear after submitting.

Clicking the candidate should show:

* Pseudocode
* Code
* AI score
* Score breakdown
* AI feedback

Do NOT build college management.

Do NOT build test creation.

Do NOT build question creation.

Do NOT build Round 2.

Do NOT build registration workflows.

Everything except the AI evaluation and candidate submission can be hardcoded for this MVP.

==================================================
DATABASE
========

Use Supabase only to persist the actual student submission and AI evaluation.

Create a simple table:

submissions

id
student_name
question
pseudocode
code
language

understanding_score
approach_score
pseudocode_score
logic_score
correctness_score
complexity_score
edge_case_score

total_score
recommendation
feedback
strengths
weaknesses

created_at

The score stored in the database MUST be the actual score returned/evaluated by Groq.

Do NOT hardcode the score.

==================================================
UI
==

Keep the design simple and professional.

Brand:

Maventic Assess

Tagline:

"Evaluate how candidates think, not just how their code runs."

Use:

* White/dark professional interface
* Blue accent
* Clean cards
* Simple navigation
* Good typography
* Responsive layout

Do not spend credits on complicated animations or unnecessary components.

==================================================
MOST IMPORTANT REQUIREMENT
==========================

The following flow MUST actually work:

Student Login
↓
Start Test
↓
See DSA Question
↓
Write Thought Process
↓
Write Code
↓
Submit
↓
Groq API
↓
llama-3.3-70b-versatile
↓
REAL AI evaluation
↓
REAL score out of 100
↓
Score stored in Supabase
↓
Student sees result
↓
Admin sees candidate result

Do NOT use mock AI responses.

Do NOT hardcode the score.

Do NOT fake the AI evaluation.

The only hardcoded parts should be:

* Admin login
* Student login
* College
* Test
* Question
* Expected approach

The editor content, submission, AI evaluation, score and result must be dynamic.

==================================================
FINAL REQUIREMENT
=================

Build this MVP completely.

Prioritize functionality over design.

Do not add features that are not requested.

Do not stop at creating the UI.

Make sure:

Student submits → Groq evaluates → real score is generated → Supabase stores it → result appears on Student and Admin dashboards.

After completing the MVP, provide the deployed URL and explain where I need to add the GROQ_API_KEY.
api key - @secret:GROQ_API_KEY

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://thinkflow-assess.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/3b810d11-02d9-4060-aa7b-bd08ce9d6dd1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
