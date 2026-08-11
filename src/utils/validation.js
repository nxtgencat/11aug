/** Quick email check: something@something.something */
export function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email)
}