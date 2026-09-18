import { defineBackend } from "@aws-amplify/backend";
import { Stack } from "aws-cdk-lib";
import { auth } from "./auth/resource";
import { data } from "./data/resource";

const backend = defineBackend({
  auth,
  data,
});

// Amplify derives the SES SourceArn from the exact fromEmail address, which
// would require verifying noreply@auth.bateman.link as its own SES identity
// (needing a reachable inbox just to click a confirmation link). Point it at
// the already-verified auth.bateman.link *domain* identity instead — SES
// allows sending from any address under a verified domain.
const { cfnUserPool } = backend.auth.resources.cfnResources;
cfnUserPool.emailConfiguration = {
  from: "Well Control Training <noreply@auth.bateman.link>",
  emailSendingAccount: "DEVELOPER",
  sourceArn: Stack.of(cfnUserPool).formatArn({
    service: "ses",
    resource: "identity",
    resourceName: "auth.bateman.link",
  }),
};
