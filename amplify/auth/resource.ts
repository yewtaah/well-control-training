import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    preferredUsername: { required: false, mutable: true },
    "custom:company": { dataType: "String", mutable: true },
    "custom:jobTitle": { dataType: "String", mutable: true },
  },
  /** `admins` can read every trainee's records for the analytics dashboard. */
  groups: ["admins"],
  senders: {
    email: {
      fromEmail: "support@doctamer.net",
      fromName: "Well Control Training",
    },
  },
});
