import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      fromEmail: "noreply@auth.bateman.link",
      fromName: "Well Control Training",
    },
  },
  /** Well Command  Assurance staff — read access to every trainee's records. */
  groups: ["admins"],
});
