import * as fs from 'fs/promises';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { GuildConfig } from '../objects/GuildConfig';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

export class ConfigManager {
	private static readonly CONFIG_DIR = path.join(__dirname, '../../configs');

	static async saveConfig(config: GuildConfig): Promise<void> {
		console.log(`Saving config for ${config.serverId}`);

		await fs.mkdir(this.CONFIG_DIR, { recursive: true });
		const filePath = path.join(this.CONFIG_DIR, `${config.serverId}.json`);
		await fs.writeFile(filePath, JSON.stringify(config.toJSON(), null, 2), 'utf-8');
	}

	static async loadConfig(serverId: string): Promise<GuildConfig | null> {
		console.log(`Loading config for ${serverId}`);
		const filePath = path.join(this.CONFIG_DIR, `${serverId}.json`);
		try {
			const raw = await fs.readFile(filePath, 'utf-8');
			const data = JSON.parse(raw);
			return GuildConfig.fromJSON(data);
		} catch (err) {
			if ((err as NodeJS.ErrnoException).code === 'ENOENT') return null;
			throw err;
		}
	}
}
