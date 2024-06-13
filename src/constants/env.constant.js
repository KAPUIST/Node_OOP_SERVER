import "dotenv/config";
export const SERVER_PORT = process.env.PORT;
export const RESUME_STATUS = {
  APPLY: "APPLY",
  DROP: "DROP",
  PASS: "PASS",
  INTERVIEW1: "INTERVIEW1",
  INTERVIEW2: "INTERVIEW2",
  FINAL_PASS: "FINAL_PASS"
};
