// import { NextFunction, Request, Response } from "express";
import { Request, Response } from "express";
// import { Errors } from "config/errors";
// import { Subscription } from "~/src/models/subscription";
// import { GitHubServerApp } from "~/src/models/github-server-app";

// export const GithubCreateBranchOptionsGet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
export const GithubCreateBranchOptionsGet = async (req: Request, res: Response): Promise<void> => {

	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('res.locals');
	console.log(res.locals);


	const { githubToken, gitHubUuid } = req.session;
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log('githubToken');
	console.log(githubToken);
	console.log('gitHubUuid');
	console.log('gitHubUuid');
	console.log('gitHubUuid');
	console.log('gitHubUuid');
	console.log('gitHubUuid');
	console.log(gitHubUuid);

	if (githubToken) {
		console.log('githubToken');
		console.log('githubToken');
		console.log('githubToken');
		console.log('githubToken');
		console.log('githubToken');
		console.log(githubToken);
		res.redirect(`/github/create-branch?issue_key=cat`);
		return;
	}
	res.render("github-create-branch-options.hbs", {
		nonce: res.locals.nonce
	});
	// const { jiraHost } = res.locals;
	// const { issue_key: key } = req.query;
	// if (!key) {
	// 	// return next(new Error(Errors.MISSING_ISSUE_KEY));
	// }
	// const servers = await getGitHubServers(jiraHost);
	// const url = new URL(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
	//
	// // Only GitHub cloud server connected
	// if (servers.hasCloudServer && servers.gheServerInfos.length == 0) {
	// 	res.redirect(`/github/create-branch${url.search}`);
	// }
	// // Only single GitHub Enterprise connected
	// if (!servers.hasCloudServer && servers.gheServerInfos.length == 1) {
	// 	res.redirect(`/github/${servers.gheServerInfos[0].uuid}/create-branch${url.search}`);
	// }
	//
	// res.render("github-create-branch-options.hbs", {
	// 	nonce: res.locals.nonce,
	// 	issueKey: key,
	// 	servers
	// });

};

// const getGitHubServers = async (jiraHost: string) => {
// 	const subscriptions = await Subscription.getAllForHost(jiraHost);
// 	const ghCloudSubscriptions = subscriptions.filter(subscription => !subscription.gitHubAppId);
// 	const gheServerSubscriptions = subscriptions.filter(subscription => subscription.gitHubAppId);
//
// 	const gheServerInfos = new Array<{ uuid: string, baseUrl: string, appName: string }>();
// 	for (const subscription of gheServerSubscriptions) {
// 		if (subscription.gitHubAppId) {
// 			const gitHubServerApp = await GitHubServerApp.getForGitHubServerAppId(subscription.gitHubAppId);
// 			if (gitHubServerApp) {
// 				gheServerInfos.push({
// 					"uuid": gitHubServerApp.uuid,
// 					"baseUrl": gitHubServerApp.gitHubBaseUrl,
// 					"appName": gitHubServerApp.gitHubAppName
// 				});
// 			}
// 		}
// 	}
//
// 	return {
// 		hasCloudServer: ghCloudSubscriptions.length,
// 		gheServerInfos
// 	};
// };