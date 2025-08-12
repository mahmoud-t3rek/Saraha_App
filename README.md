# Saraha-like API

A backend API similar to the **Saraha** app, built with **Express**, **Mongoose**, **Joi**, **Multer**, **bcrypt**, **Resend** (for email confirmation), and rate limiting.  
Includes **error handling**, **password hashing**, **secure validation**, and **email confirmation**.

---

## 📌 Features
- User registration & login with **hashed passwords**.
- **Email confirmation** after registration (via **Resend API**).
- Send & receive **anonymous messages**.
- **Input validation** using Joi.
- **File uploads** with Multer.
- **Rate limiting** to prevent spam.
- Centralized **error handling** middleware.

---

## 🛠 Technologies Used
- **Node.js / Express**
- **MongoDB / Mongoose**
- **Joi** (validation)
- **Multer** (file uploads)
- **bcrypt** (password hashing)
- **Express Rate Limit**
- **Resend** (email sending & confirmation)

---

## 📥 Installation

```bash
git clone https://github.com/mahmoud-t3rek/Saraha_App.git
cd Saraha_App
npm install
