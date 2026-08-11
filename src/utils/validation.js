// ============================================================
// validation.js — tiny helper shared by the auth forms
// ============================================================

/** Quick email check: something@something.something */
export function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}