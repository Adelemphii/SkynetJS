import { ScheduleConfig } from './ScheduleConfig';

export class GuildConfig {

	private readonly _serverId: string;
	private _adminRoleId: string;
	private _commandChannelId: string;

	private _scheduleConfig: ScheduleConfig;

	constructor(serverId: string, adminRoleId = "N/A", commandChannelId = "N/A", scheduleConfig = new ScheduleConfig()) {
		this._serverId = serverId;
		this._adminRoleId = adminRoleId;
		this._commandChannelId = commandChannelId;
		this._scheduleConfig = scheduleConfig;
	}

	get serverId(): string {
		return this._serverId;
	}

	get commandChannelId(): string {
		return this._commandChannelId;
	}

	set commandChannelId(value: string) {
		this._commandChannelId = value;
	}

	get adminRoleId(): string {
		return this._adminRoleId;
	}

	set adminRoleId(value: string) {
		this._adminRoleId = value;
	}

	get scheduleConfig(): ScheduleConfig {
		return this._scheduleConfig;
	}

	set scheduleConfig(value: ScheduleConfig) {
		this._scheduleConfig = value;
	}

	toJSON() {
		return {
			serverId: this._serverId,
			adminRoleId: this._adminRoleId,
			commandChannelId: this._commandChannelId,
			scheduleConfig: this._scheduleConfig.toJSON(),
		};
	}

	static fromJSON(data: any): GuildConfig {
		return new GuildConfig(
			data.serverId,
			data.adminRoleId,
			data.commandChannelId,
			ScheduleConfig.fromJSON(data.scheduleConfig)
		);
	}
}
