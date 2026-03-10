8️⃣ API Endpoints
Register
POST /api/auth/register

Body:

{
"name": "Vince",
"email": "vince@mail.com",
"password": "123456"
}
Login
POST /api/auth/login

Body:

{
"email": "vince@mail.com",
"password": "123456"
}

Response:

{
"success": true,
"message": "Login successful",
"data": {
"user": {},
"token": "jwt-token"
}
}
