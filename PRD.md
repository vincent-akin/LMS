I'll create a comprehensive PRD for your Course Enrollment System backend. This will be a detailed document covering all functional requirements, technical specifications, and implementation guidelines.

---

# 📋 Product Requirements Document (PRD)

## Course Enrollment Management System

**Version:** 1.0  
**Date:** March 9, 2026  
**Status:** Draft

---

## 1. Executive Summary

### 1.1 Project Overview

A robust backend API for a Course Enrollment Management System that enables educational institutions to manage courses, users, and enrollment processes with role-based access control.

### 1.2 Target Users

- **Students (Users):** Browse courses, enroll, manage their profiles
- **Staff:** Manage courses, view enrollments, assist students
- **Administrators:** Full system access, user management, analytics

### 1.3 Key Value Propositions

- Secure, scalable enrollment processing
- Real-time course availability tracking
- Automated enrollment validation (prerequisites, capacity limits)
- Comprehensive audit trails

---

## 2. Functional Requirements

### 2.1 Authentication & Authorization Module (`auth/`)

#### 2.1.1 User Registration

| Aspect             | Specification                                                                                 |
| ------------------ | --------------------------------------------------------------------------------------------- |
| **Endpoint**       | `POST /api/v1/auth/register`                                                                  |
| **Input**          | `{ email, password, firstName, lastName, role? }`                                             |
| **Validation**     | Email format, password strength (min 8 chars, 1 uppercase, 1 number, 1 special), unique email |
| **Output**         | `201 Created` - User object (password excluded), JWT token                                    |
| **Business Rules** | Default role: `user`; Only admins can create `staff` or `admin` accounts                      |

#### 2.1.2 User Login

| Aspect         | Specification                                                                    |
| -------------- | -------------------------------------------------------------------------------- |
| **Endpoint**   | `POST /api/v1/auth/login`                                                        |
| **Input**      | `{ email, password }`                                                            |
| **Validation** | Credentials verification, account status check                                   |
| **Output**     | `200 OK` - JWT access token (15min expiry), refresh token (7 days), user profile |
| **Security**   | Rate limiting: 5 attempts per 15 minutes; bcrypt password hashing                |

#### 2.1.3 Token Refresh

| Aspect       | Specification                                           |
| ------------ | ------------------------------------------------------- |
| **Endpoint** | `POST /api/v1/auth/refresh`                             |
| **Input**    | `{ refreshToken }` (HTTP-only cookie preferred)         |
| **Output**   | `200 OK` - New access token                             |
| **Security** | Refresh token rotation on each use; blacklist on logout |

#### 2.1.4 Logout

| Aspect       | Specification                           |
| ------------ | --------------------------------------- |
| **Endpoint** | `POST /api/v1/auth/logout`              |
| **Behavior** | Invalidate refresh token, clear cookies |
| **Output**   | `200 OK` - Success message              |

#### 2.1.5 Role-Based Access Control (RBAC)

| Role    | Permissions                                                                    |
| ------- | ------------------------------------------------------------------------------ |
| `admin` | Full CRUD on all entities, user management, system configuration               |
| `staff` | CRUD on courses (own/assigned), read all enrollments, update enrollment status |
| `user`  | Read courses, CRUD own enrollments, update own profile                         |

---

### 2.2 User Management Module (`user/`)

#### 2.2.1 Get Current User Profile

| Aspect       | Specification                                                    |
| ------------ | ---------------------------------------------------------------- |
| **Endpoint** | `GET /api/v1/users/me`                                           |
| **Auth**     | JWT required                                                     |
| **Output**   | `200 OK` - User profile (enrolled courses count, account status) |

#### 2.2.2 Update Profile

| Aspect           | Specification                                  |
| ---------------- | ---------------------------------------------- |
| **Endpoint**     | `PATCH /api/v1/users/me`                       |
| **Input**        | `{ firstName?, lastName?, phone?, avatar? }`   |
| **Restrictions** | Cannot update email/password via this endpoint |
| **Output**       | `200 OK` - Updated profile                     |

#### 2.2.3 Admin: List All Users

| Aspect           | Specification                             |
| ---------------- | ----------------------------------------- |
| **Endpoint**     | `GET /api/v1/users`                       |
| **Auth**         | Admin only                                |
| **Query Params** | `?role=staff&page=1&limit=20&search=john` |
| **Output**       | `200 OK` - Paginated user list            |

#### 2.2.4 Admin: Get User by ID

| Aspect       | Specification                                        |
| ------------ | ---------------------------------------------------- |
| **Endpoint** | `GET /api/v1/users/:id`                              |
| **Auth**     | Admin or own user                                    |
| **Output**   | `200 OK` - Full user details with enrollment history |

#### 2.2.5 Admin: Update User Role/Status

| Aspect           | Specification                                   |
| ---------------- | ----------------------------------------------- |
| **Endpoint**     | `PATCH /api/v1/users/:id`                       |
| **Input**        | `{ role?, isActive?, isVerified? }`             |
| **Restrictions** | Cannot demote last admin; soft delete preferred |
| **Output**       | `200 OK` - Updated user                         |

#### 2.2.6 Admin: Delete User

| Aspect       | Specification                                                                                |
| ------------ | -------------------------------------------------------------------------------------------- |
| **Endpoint** | `DELETE /api/v1/users/:id`                                                                   |
| **Behavior** | Soft delete (set `deletedAt`) if user has enrollment history; Hard delete if no dependencies |
| **Output**   | `204 No Content`                                                                             |

---

### 2.3 Course Management Module (`course/`)

#### 2.3.1 Course Schema Requirements

```javascript
{
  title: String (required, 3-100 chars),
  description: String (required, 10-2000 chars),
  code: String (required, unique, uppercase, e.g., "CS101"),
  credits: Number (required, 1-6),
  instructor: String (required),
  capacity: Number (required, min 1),
  enrolledCount: Number (default 0, auto-managed),
  schedule: {
    days: [String] (enum: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']),
    startTime: String (HH:MM format),
    endTime: String (HH:MM format),
    location: String
  },
  prerequisites: [ObjectId] (reference to other courses),
  category: String (enum: ['Technology', 'Business', 'Arts', 'Science']),
  status: String (enum: ['draft', 'published', 'archived'], default: 'draft'),
  price: Number (min 0, default 0),
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.3.2 List Courses (Public/Authenticated)

| Aspect           | Specification                                                                         |
| ---------------- | ------------------------------------------------------------------------------------- |
| **Endpoint**     | `GET /api/v1/courses`                                                                 |
| **Auth**         | Optional (public can view published)                                                  |
| **Query Params** | `?status=published&category=Technology&search=javascript&sort=-createdAt&page=1`      |
| **Filtering**    | By category, status, instructor, price range, availability (capacity > enrolledCount) |
| **Output**       | `200 OK` - Paginated course list (enrolledCount included)                             |

#### 2.3.3 Get Course Details

| Aspect       | Specification                                               |
| ------------ | ----------------------------------------------------------- |
| **Endpoint** | `GET /api/v1/courses/:id`                                   |
| **Auth**     | Public for published; Draft requires staff/admin            |
| **Output**   | `200 OK` - Full course details with prerequisites populated |

#### 2.3.4 Create Course (Staff/Admin)

| Aspect             | Specification                                                                |
| ------------------ | ---------------------------------------------------------------------------- |
| **Endpoint**       | `POST /api/v1/courses`                                                       |
| **Auth**           | Staff or Admin                                                               |
| **Input**          | Full course schema                                                           |
| **Validation**     | Code uniqueness, time format validation, prerequisite circular check         |
| **Business Rules** | New courses created as `draft`; Staff can only edit own courses unless admin |
| **Output**         | `201 Created` - Course object                                                |

#### 2.3.5 Update Course

| Aspect           | Specification                                                                       |
| ---------------- | ----------------------------------------------------------------------------------- |
| **Endpoint**     | `PATCH /api/v1/courses/:id`                                                         |
| **Auth**         | Course creator (staff) or Admin                                                     |
| **Restrictions** | Cannot reduce capacity below current enrolledCount; Cannot modify code if published |
| **Output**       | `200 OK` - Updated course                                                           |

#### 2.3.6 Delete Course

| Aspect             | Specification                                               |
| ------------------ | ----------------------------------------------------------- |
| **Endpoint**       | `DELETE /api/v1/courses/:id`                                |
| **Auth**           | Admin only (or creator if no enrollments)                   |
| **Business Rules** | Block deletion if active enrollments exist; Archive instead |
| **Output**         | `204 No Content` or `409 Conflict` with reason              |

#### 2.3.7 Course Analytics (Admin/Staff)

| Aspect       | Specification                                                          |
| ------------ | ---------------------------------------------------------------------- |
| **Endpoint** | `GET /api/v1/courses/:id/analytics`                                    |
| **Output**   | Enrollment trends, fill rate, revenue (if paid), demographic breakdown |

---

### 2.4 Enrollment Management Module (`enrollment/`)

#### 2.4.1 Enrollment Schema

```javascript
{
  user: ObjectId (ref: User, required),
  course: ObjectId (ref: Course, required),
  status: String (enum: ['pending', 'confirmed', 'completed', 'cancelled', 'dropped']),
  enrollmentDate: Date (default: now),
  completionDate: Date,
  grade: String (optional, A-F or percentage),
  paymentStatus: String (enum: ['pending', 'paid', 'refunded', 'waived']),
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2.4.2 Create Enrollment (Student Self-Enrollment)

| Aspect             | Specification                                                                                                                                                                                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Endpoint**       | `POST /api/v1/enrollments`                                                                                                                                                                                                                                                                                         |
| **Auth**           | Authenticated user                                                                                                                                                                                                                                                                                                 |
| **Input**          | `{ courseId }`                                                                                                                                                                                                                                                                                                     |
| **Business Rules** | 1. Check course exists and is published<br>2. Check capacity (enrolledCount < capacity)<br>3. Check prerequisites met (user completed prerequisite courses)<br>4. Check no duplicate active enrollment<br>5. Check schedule conflicts with existing enrollments<br>6. Auto-confirm if free course, pending if paid |
| **Output**         | `201 Created` - Enrollment object with status                                                                                                                                                                                                                                                                      |

#### 2.4.3 List My Enrollments

| Aspect           | Specification                                               |
| ---------------- | ----------------------------------------------------------- |
| **Endpoint**     | `GET /api/v1/enrollments/me`                                |
| **Auth**         | Authenticated user                                          |
| **Query Params** | `?status=confirmed&sort=-enrollmentDate`                    |
| **Output**       | `200 OK` - User's enrollments with course details populated |

#### 2.4.4 Get Enrollment Details

| Aspect       | Specification                            |
| ------------ | ---------------------------------------- |
| **Endpoint** | `GET /api/v1/enrollments/:id`            |
| **Auth**     | Enrollment owner, course staff, or admin |
| **Output**   | `200 OK` - Full enrollment details       |

#### 2.4.5 Cancel/Drop Enrollment

| Aspect             | Specification                                                                                                                                               |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Endpoint**       | `PATCH /api/v1/enrollments/:id/cancel` or `/drop`                                                                                                           |
| **Auth**           | Owner (before start date) or Admin/Staff                                                                                                                    |
| **Business Rules** | 1. Cannot cancel completed courses<br>2. Refund policy check for paid courses<br>3. Update course enrolledCount (decrement)<br>4. Notify waitlist if exists |
| **Output**         | `200 OK` - Updated enrollment                                                                                                                               |

#### 2.4.6 Staff: Update Enrollment Status

| Aspect             | Specification                                                      |
| ------------------ | ------------------------------------------------------------------ |
| **Endpoint**       | `PATCH /api/v1/enrollments/:id`                                    |
| **Auth**           | Staff (for own courses) or Admin                                   |
| **Input**          | `{ status, grade?, completionDate?, notes? }`                      |
| **Business Rules** | Status transitions: pending→confirmed→completed; confirmed→dropped |
| **Output**         | `200 OK` - Updated enrollment                                      |

#### 2.4.7 Staff: List Course Enrollments

| Aspect       | Specification                                           |
| ------------ | ------------------------------------------------------- |
| **Endpoint** | `GET /api/v1/courses/:id/enrollments`                   |
| **Auth**     | Course staff or Admin                                   |
| **Output**   | `200 OK` - All enrollments for course with user details |

#### 2.4.8 Admin: Bulk Operations

| Aspect       | Specification                            |
| ------------ | ---------------------------------------- |
| **Endpoint** | `POST /api/v1/enrollments/bulk`          |
| **Actions**  | Bulk confirm, bulk cancel, export to CSV |

---

## 3. Non-Functional Requirements

### 3.1 Database Design (MongoDB)

#### 3.1.1 Collections & Relationships

```
Users (1) ----< (N) Enrollments >---- (N) Courses
   |
   v
Courses (self-reference for prerequisites)
```

#### 3.1.2 Indexes

- `Users`: `email` (unique), `role`, `createdAt`
- `Courses`: `code` (unique), `status`, `category`, `createdBy`, `enrolledCount` (for availability queries)
- `Enrollments`: Compound index `[user, course, status]` (unique for active), `course` (for analytics), `enrollmentDate`

#### 3.1.3 Data Integrity

- Transactions for enrollment creation (check capacity + create enrollment + increment count)
- Cascading updates via MongoDB change streams or application logic

### 3.2 API Security Requirements

| Layer                  | Implementation                                                          |
| ---------------------- | ----------------------------------------------------------------------- |
| **Authentication**     | JWT (RS256 or HS256), 15min expiry, refresh token rotation              |
| **Authorization**      | Middleware checking `req.user.role` against route permissions           |
| **Input Validation**   | Joi/Zod schemas for all inputs; sanitize against NoSQL injection        |
| **Password Security**  | bcrypt, cost factor 12, pepper hashing optional                         |
| **Rate Limiting**      | `express-rate-limit`: 100 req/15min general, 5 req/15min auth endpoints |
| **CORS**               | Whitelist specific origins, credentials enabled                         |
| **Helmet**             | Security headers (CSP, HSTS, X-Frame-Options)                           |
| **Input Sanitization** | `express-mongo-sanitize`, `xss-clean`                                   |

### 3.3 Error Handling & Logging

#### 3.3.1 Error Classes (`utils/ApiError.js`)

```javascript
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational; // true = expected error, false = bug
    this.stack = stack || Error.captureStackTrace(this, this.constructor);
  }
}

// Specific errors:
// 400 BadRequestError, 401 UnauthorizedError, 403 ForbiddenError
// 404 NotFoundError, 409 ConflictError, 422 ValidationError
// 500 InternalServerError
```

#### 3.3.2 Centralized Error Middleware (`middlewares/error.middleware.js`)

- Catch all errors, format consistent JSON response
- Log operational errors to Winston/Morgan
- Alert on non-operational errors (Sentry integration)
- Don't leak stack traces in production

#### 3.3.3 Logging Strategy

| Type             | Tool               | Content                                        |
| ---------------- | ------------------ | ---------------------------------------------- |
| Request Logs     | Morgan             | Method, URL, status, response time, user ID    |
| Application Logs | Winston            | Levels: error, warn, info, debug; Rotate daily |
| Audit Logs       | MongoDB Collection | Sensitive operations (role changes, deletions) |

### 3.4 Performance Requirements

- **Response Time:** < 200ms for 95th percentile (simple queries)
- **Throughput:** Handle 1000 concurrent users
- **Pagination:** Default 20 items/page, max 100
- **Caching:** Redis for course listings (5min TTL), user sessions

---

## 4. Technical Architecture

### 4.1 Layered Architecture Pattern

```
┌─────────────────────────────────────┐
│           Routes Layer              │  ← URL routing, middleware chain
│    (auth.routes, user.routes...)    │
├─────────────────────────────────────┤
│         Controller Layer            │  ← Request/response handling, status codes
│   (auth.controller, user.controller)│
├─────────────────────────────────────┤
│          Service Layer              │  ← Business logic, validation, orchestration
│    (auth.service, user.service)     │
├─────────────────────────────────────┤
│        Repository Layer             │  ← Database operations, queries
│   (auth.repository, user.repository)│
├─────────────────────────────────────┤
│         Database (MongoDB)          │  ← Mongoose models, indexes
└─────────────────────────────────────┘
```

### 4.2 File Structure Details

```
src/
├── config/
│   └── db.js                 # MongoDB connection, mongoose config
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.js    # handleRegister, handleLogin, handleRefresh, handleLogout
│   │   ├── auth.service.js       # registerUser, authenticateUser, generateTokens, blacklistToken
│   │   ├── auth.repository.js    # createUser, findUserByEmail, saveRefreshToken
│   │   ├── auth.routes.js        # POST /register, /login, /refresh, /logout
│   │   └── auth.schema.js        # Joi schemas: registerSchema, loginSchema
│   │
│   ├── user/
│   │   ├── user.controller.js    # getProfile, updateProfile, listUsers, etc.
│   │   ├── user.service.js       # getUserById, updateUser, deleteUser (soft/hard)
│   │   ├── user.repository.js    # findById, findAll, update, softDelete
│   │   ├── user.routes.js        # CRUD routes with role middleware
│   │   └── user.schema.js        # updateProfileSchema, adminUpdateSchema
│   │
│   ├── course/
│   │   ├── course.controller.js  # CRUD operations, analytics
│   │   ├── course.service.js     # createCourse, checkPrerequisites, checkScheduleConflict
│   │   ├── course.repository.js  # findWithFilters, updateEnrolledCount
│   │   ├── course.routes.js      # Public GET, Protected POST/PATCH/DELETE
│   │   └── course.schema.js      # courseCreateSchema, courseUpdateSchema
│   │
│   └── enrollment/
│       ├── enrollment.controller.js  # enroll, cancel, list, updateStatus
│       ├── enrollment.service.js     # validateEnrollment, processWaitlist, checkConflicts
│       ├── enrollment.repository.js  # createEnrollment, findByUser, findByCourse
│       ├── enrollment.routes.js      # User self-service, Staff management
│       └── enrollment.schema.js      # enrollmentCreateSchema, statusUpdateSchema
│
├── middlewares/
│   ├── auth.middleware.js      # verifyJWT, requireRole(['admin', 'staff'])
│   └── error.middleware.js     # globalErrorHandler, notFoundHandler
│
├── utils/
│   ├── ApiError.js             # Custom error classes
│   └── ApiResponse.js          # Standardized success response wrapper
│
├── app.js                      # Express app setup, middleware mounting
└── server.js                   # Server bootstrap, DB connection, port listening
```

### 4.3 Middleware Specifications

#### 4.3.1 Authentication Middleware (`auth.middleware.js`)

```javascript
// verifyJWT - Extract token from Authorization: Bearer <token> or cookie
// Decode, verify signature, attach req.user = { userId, email, role, iat, exp }

// requireRole(roles[]) - Check if req.user.role is in allowed array
// Return 403 if unauthorized

// optionalAuth - Attach user if token present, allow guest access
```

#### 4.3.2 Validation Middleware

```javascript
// validate(schema) - Joi/Zod validation
// Return 422 with detailed error messages if invalid
```

### 4.4 Utility Classes

#### 4.4.1 ApiResponse.js

```javascript
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }

  static success(res, data, message, statusCode = 200) {
    return res
      .status(statusCode)
      .json(new ApiResponse(statusCode, data, message));
  }

  static paginated(res, data, pagination) {
    // { page, limit, total, totalPages, hasNext }
  }
}
```

---

## 5. API Documentation (Swagger/OpenAPI)

### 5.1 Documentation Requirements

- **Tool:** Swagger UI via `swagger-jsdoc` and `swagger-ui-express`
- **Path:** `/api/v1/docs` (accessible without auth in dev, admin-only in prod)
- **Coverage:** 100% of endpoints with request/response examples

### 5.2 Example Endpoint Documentation

```yaml
/courses:
  get:
    summary: List all courses
    tags: [Courses]
    parameters:
      - in: query
        name: category
        schema: { type: string, enum: [Technology, Business, Arts, Science] }
      - in: query
        name: status
        schema:
          {
            type: string,
            enum: [draft, published, archived],
            default: published,
          }
      - in: query
        name: available
        schema:
          { type: boolean, description: "Only show courses with open seats" }
    responses:
      200:
        description: Paginated list of courses
        content:
          application/json:
            example:
              statusCode: 200
              message: "Courses retrieved successfully"
              data:
                courses: [{ _id: "...", title: "Intro to Node.js", ... }]
                pagination: { page: 1, limit: 20, total: 150, totalPages: 8 }
```

---

## 6. Implementation Phases

### Phase 1: Foundation (Week 1)

- [ ] Project setup (Express, Mongoose, folder structure)
- [ ] Database connection & models (User, Course, Enrollment)
- [ ] Error handling utilities & middleware
- [ ] Logging configuration

### Phase 2: Authentication (Week 1-2)

- [ ] JWT authentication system
- [ ] Registration/Login endpoints
- [ ] RBAC middleware
- [ ] Password hashing & security

### Phase 3: Core CRUD (Week 2-3)

- [ ] User management (profile, admin operations)
- [ ] Course CRUD with validation
- [ ] Enrollment creation with business rules

### Phase 4: Business Logic (Week 3-4)

- [ ] Prerequisite validation
- [ ] Schedule conflict detection
- [ ] Capacity management & waitlist
- [ ] Soft deletes & archiving

### Phase 5: Polish (Week 4)

- [ ] Swagger documentation
- [ ] Comprehensive testing (unit, integration)
- [ ] Performance optimization (indexes, caching)
- [ ] Security audit & hardening

---

## 7. Success Criteria

| Metric                        | Target                       |
| ----------------------------- | ---------------------------- |
| Code Coverage                 | > 80%                        |
| API Response Time (p95)       | < 200ms                      |
| Zero security vulnerabilities | Pass OWASP Top 10 check      |
| Uptime                        | 99.9%                        |
| Documentation Completeness    | 100% of endpoints documented |

---

## 8. Appendices

### Appendix A: Environment Variables

```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/course_enrollment
JWT_ACCESS_SECRET=your-access-secret-min-32-chars
JWT_REFRESH_SECRET=your-refresh-secret-min-32-chars
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d
BCRYPT_ROUNDS=12
REDIS_URL=redis://localhost:6379
LOG_LEVEL=debug
```

### Appendix B: HTTP Status Code Usage

| Code | Usage                                               |
| ---- | --------------------------------------------------- |
| 200  | Successful GET, PATCH                               |
| 201  | Successful POST (resource created)                  |
| 204  | Successful DELETE                                   |
| 400  | Bad request (malformed syntax)                      |
| 401  | Unauthorized (invalid/missing token)                |
| 403  | Forbidden (valid token, insufficient permissions)   |
| 404  | Resource not found                                  |
| 409  | Conflict (duplicate email, business rule violation) |
| 422  | Validation error (Joi/Zod validation failed)        |
| 429  | Too many requests (rate limit)                      |
| 500  | Internal server error (unexpected)                  |

---

This PRD provides a complete blueprint for building your Course Enrollment System. Each module is designed to be independently testable and maintainable following the layered architecture pattern.
