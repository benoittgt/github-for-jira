import Logger, { createLogger, INFO, levelFromName, stdSerializers } from "bunyan";
import { RawLogStream } from "utils/logger-utils";
import { Request } from "express";
import { AxiosResponse } from "axios";

export const FILTERING_FRONTEND_HTTP_LOGS_MIDDLEWARE_NAME = "frontend-log-middleware";

const responseSerializer = (res: AxiosResponse) => ({
	...stdSerializers.res(res),
	config: res?.config,
	request: requestSerializer(res.request)
});

const requestSerializer = (req: Request) => (!req || !req.socket) ? req : {
	method: req.method,
	url: req.originalUrl || req.url,
	path: req.path,
	headers: req.headers,
	remoteAddress: req.socket.remoteAddress,
	remotePort: req.socket.remotePort,
	body: req.body
};

const errorSerializer = (err) => err && {
	...err,
	response: stdSerializers.res(err.response),
	request: requestSerializer(err.request)
};

const logLevel = process.env.LOG_LEVEL || "info";
const globalLoggingLevel = levelFromName[logLevel] || INFO;

// TODO Remove after upgrading Probot to the latest version (override logger via constructor instead)
export const overrideProbotLoggingMethods = (probotLogger: Logger) => {
	// Remove  Default Probot Logging Stream
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	(probotLogger as any).streams.pop();

	// Replace with formatOut stream
	// Add standard stream
	probotLogger.addStream({
		type: "raw",
		stream: new RawLogStream(FILTERING_FRONTEND_HTTP_LOGS_MIDDLEWARE_NAME),
		closeOnExit: false,
		level: globalLoggingLevel
	});
	// add unsafe stream
	probotLogger.addStream({
		type: "raw",
		stream: new RawLogStream(FILTERING_FRONTEND_HTTP_LOGS_MIDDLEWARE_NAME, true),
		closeOnExit: false,
		level: globalLoggingLevel
	});
};

const createNewLogger = (name: string, fields?: Record<string, unknown>): Logger => {
	return createLogger(
		{
			name,
			streams: [
				{
					type: "raw",
					stream: new RawLogStream(FILTERING_FRONTEND_HTTP_LOGS_MIDDLEWARE_NAME),
					closeOnExit: false, // todo whats this do
					level: globalLoggingLevel
				},
				{
					type: "raw",
					stream: new RawLogStream(FILTERING_FRONTEND_HTTP_LOGS_MIDDLEWARE_NAME, true),
					closeOnExit: false,
					level: globalLoggingLevel
				}
			],
			level: globalLoggingLevel,
			serializers: {
				err: errorSerializer,
				res: responseSerializer,
				req: requestSerializer
			},
			...fields
		});
};

export const getLogger = (name: string, fields?: Record<string, unknown>): Logger => {
	const logger = createNewLogger(name);
	return logger.child({ ...fields });
};

export const cloneAllowedLogFields = (fields: Record<string, any>) => {
	const allowedFields = { ...fields };
	delete allowedFields.name;
	return allowedFields;
};

//Override console.log with bunyan logger.
//we shouldn't use console.log in our code, but it is done to catch
//possible logs from third party libraries
const consoleLogger = getLogger("console");
// eslint-disable-next-line no-console
console.debug = consoleLogger.debug.bind(consoleLogger);
// eslint-disable-next-line no-console
console.error = consoleLogger.error.bind(consoleLogger);
// eslint-disable-next-line no-console
console.log = consoleLogger.info.bind(consoleLogger);
// eslint-disable-next-line no-console
console.warn = consoleLogger.warn.bind(consoleLogger);
