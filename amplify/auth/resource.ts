import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  senders: {
    email: {
      fromEmail: "support@doctamer.net",
      fromName: "Well Control Training",
    },
  },
});
