import { Writable } from "stream";
import safeJsonStringify from "safe-json-stringify";
import bformat from "bunyan-format";
import { DEBUG } from "bunyan";
import { createHashWithSharedSecret } from "utils/encryption";
import { isNodeDev } from "utils/is-node-env";

const SENSITIVE_DATA_FIELDS = ["jiraHost", "orgName", "repoName", "userGroup", "userGroup", "aaid", "username", "prTitle", "prRef", "owner", "description", "repo"];
// For any Micros env we want the logs to be in JSON format.
// Otherwise, if local development, we want human readable logs.
const outputMode = process.env.MICROS_ENV ? "json" : "short";

type ChunkData = {
	msg?: string;
	filterHttpRequests?: boolean;
	level?: number | undefined;
	/* eslint-disable @typescript-eslint/no-explicit-any */
	[key:string]: any
}

type Callback = (error?: Error | null) => void;

//  See https://github.com/probot/probot/issues/1577
export const filterHttpRequests = (record: ChunkData) => {
	const { msg, filterHttpRequests } = record;
	return !!filterHttpRequests && /(GET|POST|DELETE|PUT|PATCH)/.test(msg || "");
};

class RawLogStream extends Writable {
	private readonly writeStream: NodeJS.WritableStream;

	public constructor() {
		super({ objectMode: true });
		this.writeStream = bformat({ outputMode, levelInString: true, color: isNodeDev() });
	}

	public async _write(record: ChunkData, encoding: BufferEncoding, next: Callback): Promise<void> {

		// Skip unwanted logs
		if (filterHttpRequests(record)) {
			return next();
		}

		const chunk = safeJsonStringify(record) + "\n";
		this.writeStream.write(chunk, encoding);
		next();
	}
}

export class SafeRawLogStream extends RawLogStream {

	public async _write(record: ChunkData, encoding: BufferEncoding, next: Callback): Promise<void> {
		const hashedRecord = this.hashSensitiveData(record);
		await super._write(hashedRecord, encoding, next);
	}

	private hashSensitiveData(record: ChunkData): Record<string, string | undefined> {
		const recordClone = { ...record };

		Object.keys(recordClone).forEach(key => {
			if (SENSITIVE_DATA_FIELDS.includes(key)) {
				recordClone[key] = createHashWithSharedSecret(recordClone[key]);
			}
		});

		return recordClone;
	}
}

export class UnsafeRawLogStream extends RawLogStream {

	public async _write(record: ChunkData, encoding: BufferEncoding, next: Callback): Promise<void> {

		// Skip any log above DEBUG level
		if (!record.level || isNaN(record.level) || record.level > DEBUG) {
			return next();
		}
		// Tag the record do it gets indexed to the _unsafe logging environment
		record.env_suffix = "unsafe";
		await super._write(record, encoding, next);
	}
}
