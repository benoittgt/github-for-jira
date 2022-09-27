import { JiraCommit, JiraCommitData } from "interfaces/jira";
import { getJiraAuthor, jiraIssueKeyParser, limitCommitMessage } from "utils/jira-utils";
import { isEmpty } from "lodash";
import { transformRepositoryId } from "~/src/transforms/transform-repository-id";

export const mapCommit = (commit): JiraCommit | undefined => {
	const issueKeys = jiraIssueKeyParser(commit.message);
	if (isEmpty(issueKeys)) {
		return undefined;
	}

	return {
		author: getJiraAuthor(commit.author),
		authorTimestamp: commit.authoredDate,
		displayId: commit.oid.substring(0, 6),
		fileCount: commit.changedFiles || 0,
		hash: commit.oid,
		id: commit.oid,
		issueKeys,
		message: limitCommitMessage(commit.message),
		url: commit.url || undefined, // If blank string, don't send url
		updateSequenceId: Date.now()
	};
};

// TODO: type payload and return better
/**
 *
 * @param payload
 * @param ghesBaseUrl - must be undefined for Cloud and provided for GHES
 */
export const transformCommit = (payload, ghesBaseUrl?: string): JiraCommitData | undefined => {
	// TODO: use reduce instead of map/filter combo
	const commits = payload.commits
		.map((commit) => mapCommit(commit))
		.filter((commit) => !!commit);

	if (commits.length === 0) {
		return undefined;
	}

	return {
		commits: commits,
		// here
		id: transformRepositoryId(payload.repository.id, ghesBaseUrl),
		name: payload.repository.full_name,
		url: payload.repository.html_url,
		updateSequenceId: Date.now()
	};
};
