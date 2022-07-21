import { Router } from "express";
import { JiraJwtTokenMiddleware } from "middleware/jira-jwt-middleware";
import { csrfMiddleware } from "middleware/csrf-middleware";
import {
	JiraConnectEnterpriseAppCreateOrEdit
} from "routes/jira/connect/enterprise/app/jira-connect-enterprise-app-create-or-edit";
import { JiraConnectEnterpriseAppPost } from "routes/jira/connect/enterprise/app/jira-connect-enterprise-app-post";
import { JiraConnectEnterpriseAppPut } from "routes/jira/connect/enterprise/app/jira-connect-enterprise-app-put";
import { JiraConnectEnterpriseAppDelete } from "routes/jira/connect/enterprise/app/jira-connect-enterprise-app-delete";

export const JiraConnectEnterpriseAppRouter = Router();

JiraConnectEnterpriseAppRouter.use(csrfMiddleware);
JiraConnectEnterpriseAppRouter.use(JiraJwtTokenMiddleware);

JiraConnectEnterpriseAppRouter.post("/", JiraConnectEnterpriseAppPost);

JiraConnectEnterpriseAppRouter.route("/:uuid")
	.get(JiraConnectEnterpriseAppCreateOrEdit)
	.put(JiraConnectEnterpriseAppPut)
	.delete(JiraConnectEnterpriseAppDelete);
