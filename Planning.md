````markdown
# AI-Powered Job Recruitment & Career Assistant

## Roles

We'll have two roles:


role = "user"
role = "admin"
````

---

# 1. User

## User Can

* Register
* Login
* Browse jobs
* Search/filter jobs
* View job details
* Apply for jobs
* Withdraw application
* Track application status
* Upload/manage resume
* Resume analysis with Gemini
* Generate cover letter
* AI interview preparation
* View personal dashboard

---

# 2. Admin

## Admin Can

* Login
* Create jobs
* View jobs
* Update jobs
* Delete jobs
* View all applicants
* View applicants for a specific job
* Update application status
* View job statistics
* View overall platform statistics

---

# 3. Authentication Routes

```text
POST /api/auth/signup
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Both users and admins authenticate through these routes.

---

# 4. Admin Job Routes

```text
POST   /api/admin/jobs
GET    /api/admin/jobs
GET    /api/admin/jobs/:id
PATCH  /api/admin/jobs/:id
DELETE /api/admin/jobs/:id
```

These routes require:

```text
JWT + Admin Role
```

---

# 5. User Job Routes

Users don't manage jobs.

They can browse jobs:

```text
GET /api/jobs
GET /api/jobs/:id
```

These can be public or authenticated depending on what we decide later.

---

# 6. Applications

Applications connect users with jobs.

## User Routes

```text
POST   /api/applications
GET    /api/applications
GET    /api/applications/:id
DELETE /api/applications/:id
```

### Example

```json
{
  "jobId": 15,
  "resumeId": 3
}
```

---

## Admin Routes

```text
GET   /api/admin/applications
GET   /api/admin/applications/:id
PATCH /api/admin/applications/:id/status
```

### Application Status Flow

```text
Applied
   ↓
Shortlisted
   ↓
Interview
   ↓
Selected
```

Or:

```text
Applied → Rejected
```

---

# 7. Gemini AI Routes

These are primarily User features.

```text
POST /api/ai/resume-analysis
POST /api/ai/cover-letter
POST /api/ai/interview-questions
POST /api/ai/evaluate-answer
```

## Resume Analysis Flow

```text
User
  ↓
Selects Job
  ↓
Selects Resume
  ↓
Resume + Job Description
  ↓
Gemini
  ↓
ATS Analysis
```

The analysis can include:

* ATS score
* Matching skills
* Missing skills
* Resume improvement suggestions
* Job-resume compatibility

---

# 8. Admin Dashboard Routes

```text
GET /api/admin/dashboard/summary
GET /api/admin/dashboard/job-stats
GET /api/admin/dashboard/application-stats
```

## Example: Dashboard Summary

```json
{
  "totalJobs": 18,
  "totalUsers": 1250,
  "totalApplications": 3420,
  "activeJobs": 12,
  "closedJobs": 6
}
```

## Example: Job Statistics

```json
{
  "jobTitle": "Software Development Engineer",
  "totalApplicants": 125,
  "applied": 80,
  "shortlisted": 25,
  "interview": 12,
  "selected": 1,
  "rejected": 7
}
```

---

# 9. Database Structure

Instead of having only:

```text
Users
Jobs
Resumes
Interviews
```

we'll have:

```text
Users
  │
  ├──────── Jobs (created by Admin)
  │
  ├──────── Resumes
  │
  ├──────── Applications
  │
  └──────── Interviews

Jobs
  │
  └──────── Applications

Applications
  │
  ├── User
  ├── Job
  └── Resume
```

---

# 10. Key Database Relationship

The most important relationship is:

```text
User ─────── Application ─────── Job
```

This allows the system to answer questions such as:

* How many people applied for this job?
* Which users applied for this job?
* What is the current status of a user's application?
* Which resume did the user use to apply?
* How many candidates reached the interview stage?
* How many candidates were selected?

---

# 11. Overall Application Architecture

```text
                    APPLICATION
                         │
             ┌───────────┴───────────┐
             ↓                       ↓
          USER SIDE              ADMIN SIDE
             │                       │
        Find Jobs               Create Jobs
        Apply                   Edit Jobs
        Track Status            Delete Jobs
        Manage Resume            View Applicants
        Resume AI                Update Status
        Cover Letter             View Statistics
        AI Interview             Manage Jobs
        Dashboard
             │                       │
             └───────────┬───────────┘
                         ↓
                     GEMINI AI
```

---

# 12. Complete API Route Structure

```text
/api
│
├── /auth
│   ├── POST   /signup
│   ├── POST   /login
│   ├── GET    /me
│   └── POST   /logout
│
├── /jobs
│   ├── GET    /
│   └── GET    /:id
│
├── /admin/jobs
│   ├── POST   /
│   ├── GET    /
│   ├── GET    /:id
│   ├── PATCH  /:id
│   └── DELETE /:id
│
├── /applications
│   ├── POST   /
│   ├── GET    /
│   ├── GET    /:id
│   └── DELETE /:id
│
├── /admin/applications
│   ├── GET    /
│   ├── GET    /:id
│   └── PATCH  /:id/status
│
├── /ai
│   ├── POST   /resume-analysis
│   ├── POST   /cover-letter
│   ├── POST   /interview-questions
│   └── POST   /evaluate-answer
│
└── /admin/dashboard
    ├── GET    /summary
    ├── GET    /job-stats
    └── GET    /application-stats
```

---

# 13. Access Control

| Feature                   | User | Admin |
| ------------------------- | :--: | :---: |
| Signup                    |   ✅  |   ❌   |
| Login                     |   ✅  |   ✅   |
| Browse Jobs               |   ✅  |   ✅   |
| Create Job                |   ❌  |   ✅   |
| Update Job                |   ❌  |   ✅   |
| Delete Job                |   ❌  |   ✅   |
| Apply for Job             |   ✅  |   ❌   |
| View Own Applications     |   ✅  |   ❌   |
| View All Applications     |   ❌  |   ✅   |
| Update Application Status |   ❌  |   ✅   |
| Manage Resume             |   ✅  |   ❌   |
| Resume Analysis           |   ✅  |   ❌   |
| Cover Letter              |   ✅  |   ❌   |
| AI Interview              |   ✅  |   ❌   |
| Personal Dashboard        |   ✅  |   ❌   |
| Admin Dashboard           |   ❌  |   ✅   |
| Job Statistics            |   ❌  |   ✅   |
| Platform Statistics       |   ❌  |   ✅   |

---





