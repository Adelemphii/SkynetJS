import { Mission } from './Mission.ts';

export class ScheduleConfig {

	private _minutesBeforeTimer: number = 30;
	private _scheduleChannel: string = "N/A";
	private _timelineChannel: string = "N/A";
	private _timelineMessage: string = "N/A";
	private _timelineMessageIcon: string = "N/A";

	private _missions: Mission[] = [];

	getMissionByTimelineMessageId(messageId: string): Mission | undefined {
		return this._missions.find(m => {
			return m.timelineMessageId === messageId;
		});
	}

	getMissionByScheduleMessageId(messageId: string): Mission | undefined {
		return this._missions.find(m => m.scheduleMessageId === messageId);
	}

	get minutesBeforeTimer(): number {
		return this._minutesBeforeTimer;
	}

	set minutesBeforeTimer(value: number) {
		this._minutesBeforeTimer = value;
	}

	get scheduleChannel(): string {
		return this._scheduleChannel;
	}

	set scheduleChannel(value: string) {
		this._scheduleChannel = value;
	}

	get timelineChannel(): string {
		return this._timelineChannel;
	}

	set timelineChannel(value: string) {
		this._timelineChannel = value;
	}

	get timelineMessage(): string {
		return this._timelineMessage;
	}

	set timelineMessage(value: string) {
		this._timelineMessage = value;
	}

	get missions(): Mission[] {
		return this._missions;
	}

	set missions(value: Mission[]) {
		this._missions = value;
	}

	get timelineMessageIcon(): string {
		return this._timelineMessageIcon;
	}

	set timelineMessageIcon(value: string) {
		this._timelineMessageIcon = value;
	}

	addMission(mission: Mission) {
		this._missions.push(mission);
	}

	removeMissionWithTimelineId(timelineId: string) {
		this._missions = this._missions.filter(mission => mission.timelineMessageId !== timelineId);
	}

	toJSON() {
		return {
			minutesBeforeTimer: this._minutesBeforeTimer,
			scheduleChannel: this._scheduleChannel,
			timelineChannel: this._timelineChannel,
			timelineMessage: this._timelineMessage,
			timelineMessageIcon: this._timelineMessageIcon,
			missions: this._missions.map(m => m.toJSON()),
		};
	}

	static fromJSON(data: any): ScheduleConfig {
		const config = new ScheduleConfig();
		config.minutesBeforeTimer = data.minutesBeforeTimer ?? 30;
		config.scheduleChannel = data.scheduleChannel ?? "N/A";
		config.timelineChannel = data.timelineChannel ?? "N/A";
		config.timelineMessage = data.timelineMessage ?? "N/A";
		config.timelineMessageIcon = data.timelineMessageIcon ?? "N/A";
		config.missions = Array.isArray(data.missions) ? data.missions.map((m: any) => Mission.fromJSON(m)) : [];
		return config;
	}
}
