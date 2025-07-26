import { Message } from 'discord.js';

export type ParticipationStatus = 'joining' | 'maybe' | 'not_joining';

export interface MissionParticipant {
	userId: string;
	status: ParticipationStatus;
}

export class Mission {
	constructor(
		public readonly scheduleMessageId: string,
		public opName: string,
		public timestamp: number,
		public loreLines: string[],
		public reminderSent: boolean = false,
		public modpackInfo?: string,
		public timelineMessageId?: string,
		public sheetUrl?: string,
		private participants: Map<string, ParticipationStatus> = new Map(),
	) {}

	public addOrUpdateParticipant(userId: string, status: ParticipationStatus) {
		this.participants.set(userId, status);
	}

	public removeParticipant(userId: string) {
		this.participants.delete(userId);
	}

	public getParticipantsByStatus(status: ParticipationStatus): string[] {
		return Array.from(this.participants.entries())
			.filter(([, s]) => s === status)
			.map(([userId]) => userId);
	}

	public getAllParticipants(): MissionParticipant[] {
		return Array.from(this.participants.entries()).map(([userId, status]) => ({
			userId,
			status,
		}));
	}

	public toJSON(): Record<string, unknown> {
		return {
			scheduleMessageId: this.scheduleMessageId,
			opName: this.opName,
			timestamp: this.timestamp,
			loreLines: this.loreLines,
			reminderSent: this.reminderSent,
			modpackInfo: this.modpackInfo,
			timelineMessageId: this.timelineMessageId,
			sheetUrl: this.sheetUrl,
			participants: this.getAllParticipants(),
		};
	}

	public static fromJSON(data: any): Mission {
		const mission = new Mission(
			data.scheduleMessageId,
			data.opName,
			data.timestamp,
			data.loreLines ?? [],
			data.reminderSent ?? false,
			data.modpackInfo,
			data.timelineMessageId,
			data.sheetUrl,
			new Map()
		);

		// Convert array of participants back to Map
		if (Array.isArray(data.participants)) {
			for (const participant of data.participants) {
				if (participant.userId && participant.status) {
					mission.addOrUpdateParticipant(participant.userId, participant.status);
				}
			}
		}

		return mission;
	}

	static parseMissionFromMessage(message: Message): Mission | null {
		const content = message.content;
		const lines = content.split('\n').map(line => line.trim());

		// Extract Sheet/Spreadsheet URL (if any)
		let sheetUrl: string | undefined = undefined;
		for (const line of lines) {
			if (/^(Sheet|Spreadsheet):/i.test(line)) {
				const match = line.match(/(https?:\/\/\S+)/);
				if (match) {
					sheetUrl = match[1];
					break;
				}
			}
		}

		const excludePatterns: RegExp[] = [
			/^@everyone$/,
			/^@here$/,
			/^Sheet:/i,
			/^Spreadsheet:/i,
			/^Map:/i,
			/^https?:\/\/\S+$/,
			/^<t:\d+:[fR]?>$/,
			/^Difficulty:\s*\d+\/\d+$/i,
			/^[-=*]{3,}$/,
		];

		const filteredLines = lines.filter(line =>
			!excludePatterns.some(pattern => pattern.test(line))
		);

		let modpackInfo: string | undefined;
		let currentLineIndex = 0;

		const modpackMatch = filteredLines[0].match(/^\[(.+)]$/);
		if (modpackMatch) {
			modpackInfo = modpackMatch[1];
			currentLineIndex++;
		}

		const opLine = filteredLines[currentLineIndex];
		const opMatch = opLine.match(/^(.*?)\s*(?:\|\s*)?<t:(\d+):?[tTdDfFR]?>$/);
		if (!opMatch) return null;

		const opName = opMatch[1];
		const unixTimestamp = parseInt(opMatch[2], 10);
		const loreLines = filteredLines.slice(currentLineIndex + 1);

		const mission = new Mission(message.id, opName, unixTimestamp, loreLines, false, modpackInfo);
		mission.sheetUrl = sheetUrl;
		return mission;
	}
}
