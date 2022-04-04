import { transformWorkflow } from "../transforms/transform-workflow";
import { CustomContext } from "middleware/github-webhook-middleware";
import { emitWebhookProcessedMetrics } from "utils/webhook-utils";
import { GitHubInstallationClient } from "./client/github-installation-client";
import { getCloudInstallationId } from "./client/installation-id";

export const workflowWebhookHandler = async (context: CustomContext, jiraClient, _util, githubInstallationId: number): Promise<void> => {
	const { payload, log: logger } = context;
	const githubClient = new GitHubInstallationClient(getCloudInstallationId(githubInstallationId), logger);
	const jiraPayload = await transformWorkflow(githubClient, payload, logger);

	if (!jiraPayload) {
		logger.info(
			{ noop: "no_jira_payload_workflow_run" },
			"Halting further execution for workflow since jiraPayload is empty"
		);
		return;
	}

	logger.info(`Sending workflow event to Jira: ${jiraClient.baseURL}`);

	const jiraResponse = await jiraClient.workflow.submit(jiraPayload, payload.repository.id);
	const { webhookReceived, name, log } = context;

	webhookReceived && emitWebhookProcessedMetrics(
		webhookReceived,
		name,
		log,
		jiraResponse?.status
	);
};
