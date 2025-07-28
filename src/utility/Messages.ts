import { Locale } from 'discord.js';
import { GuildConfig } from '../objects/GuildConfig';
import { Mission } from '../objects/Mission';

/**
 * I'm well aware this should be like a bunch of json files to read from, and it'd be WAY cleaner- but I've already done this much
 * and I apologize.
 */
export class Messages {
	static readonly SERVER_ONLY: Record<string, string> = {
		en: '❌ This command can only be used in a server.',
		pl: '❌ Tę komendę można używać tylko na serwerze.',
		de: '❌ Dieser Befehl kann nur auf einem Server verwendet werden.',
		fr: '❌ Cette commande ne peut être utilisée que sur un serveur.',
		es: '❌ Este comando solo se puede usar en un servidor.',
	};
	static readonly SERVER_INFO = {
		en: (name: string) => `📊 Server Info: ${name}`,
		pl: (name: string) => `📊 Informacje o serwerze: ${name}`,
		de: (name: string) => `📊 Serverinformationen: ${name}`,
		fr: (name: string) => `📊 Informations du serveur: ${name}`,
		es: (name: string) => `📊 Información del servidor: ${name}`,
	};
	static readonly MEMBERS: Record<string, string> = {
		en: '👥 Members',
		pl: '👥 Członkowie',
		de: '👥 Mitglieder',
		fr: '👥 Membres',
		es: '👥 Miembros',
	};
	static readonly SERVER_CONFIG: Record<string, string> = {
		en: '🛠️ Server Config',
		pl: '🛠️ Konfiguracja serwera',
		de: '🛠️ Serverkonfiguration',
		fr: '🛠️ Configuration du serveur',
		es: '🛠️ Configuración del servidor',
	};
	static readonly SERVER_ID = {
		en: (config: GuildConfig) => `**Server ID:** ${config?.serverId ?? 'N/A'}`,
		pl: (config: GuildConfig) => `**ID Serwera:** ${config?.serverId ?? 'Brak'}`,
		de: (config: GuildConfig) => `**Server-ID:** ${config?.serverId ?? 'Nicht verfügbar'}`,
		fr: (config: GuildConfig) => `**ID du serveur :** ${config?.serverId ?? 'Indisponible'}`,
		es: (config: GuildConfig) => `**ID del servidor:** ${config?.serverId ?? 'No disponible'}`,
	};
	static readonly ADMIN_ROLE = {
		en: (config: GuildConfig) => `**Admin Role ID:** <@&${config?.adminRoleId ?? 'N/A'}>`,
		pl: (config: GuildConfig) => `**ID roli administratora:** <@&${config?.adminRoleId ?? 'Brak'}>`,
		de: (config: GuildConfig) => `**Admin-Rollen-ID:** <@&${config?.adminRoleId ?? 'Nicht verfügbar'}>`,
		fr: (config: GuildConfig) => `**ID du rôle admin :** <@&${config?.adminRoleId ?? 'Indisponible'}>`,
		es: (config: GuildConfig) => `**ID del rol de administrador:** <@&${config?.adminRoleId ?? 'No disponible'}>`,
	};
	static readonly COMMAND_CHANNEL = {
		en: (config: GuildConfig) => `**Command Channel ID:** <#${config?.commandChannelId ?? 'N/A'}>`,
		pl: (config: GuildConfig) => `**ID kanału komend:** <#${config?.commandChannelId ?? 'Brak'}>`,
		de: (config: GuildConfig) => `**Befehlskanal-ID:** <#${config?.commandChannelId ?? 'Nicht verfügbar'}>`,
		fr: (config: GuildConfig) => `**ID du canal de commande :** <#${config?.commandChannelId ?? 'Indisponible'}>`,
		es: (config: GuildConfig) => `**ID del canal de comandos:** <#${config?.commandChannelId ?? 'No disponible'}>`,
	};
	static readonly SCHEDULE_CONFIG: Record<string, string> = {
		en: '📅 Schedule Config',
		pl: '📅 Konfiguracja harmonogramu',
		de: '📅 Zeitplan-Konfiguration',
		fr: '📅 Configuration du calendrier',
		es: '📅 Configuración del horario',
	};
	static readonly SCHEDULE_CHANNEL = {
		en: (config: GuildConfig) => `**Schedule Channel ID:** <#${config?.scheduleConfig?.scheduleChannel ?? 'N/A'}>`,
		pl: (config: GuildConfig) => `**ID kanału harmonogramu:** <#${config?.scheduleConfig?.scheduleChannel ?? 'Brak'}>`,
		de: (config: GuildConfig) => `**Zeitplankanal-ID:** <#${config?.scheduleConfig?.scheduleChannel ?? 'Nicht verfügbar'}>`,
		fr: (config: GuildConfig) => `**ID du canal de calendrier :** <#${config?.scheduleConfig?.scheduleChannel ?? 'Indisponible'}>`,
		es: (config: GuildConfig) => `**ID del canal de horario:** <#${config?.scheduleConfig?.scheduleChannel ?? 'No disponible'}>`,
	};
	static readonly TIMELINE_CHANNEL = {
		en: (config: GuildConfig) => `**Timeline Channel ID:** <#${config?.scheduleConfig?.timelineChannel ?? 'N/A'}>`,
		pl: (config: GuildConfig) => `**ID kanału osi czasu:** <#${config?.scheduleConfig?.timelineChannel ?? 'Brak'}>`,
		de: (config: GuildConfig) => `**Zeitachsenkanal-ID:** <#${config?.scheduleConfig?.timelineChannel ?? 'Nicht verfügbar'}>`,
		fr: (config: GuildConfig) => `**ID du canal de chronologie :** <#${config?.scheduleConfig?.timelineChannel ?? 'Indisponible'}>`,
		es: (config: GuildConfig) => `**ID del canal de línea de tiempo:** <#${config?.scheduleConfig?.timelineChannel ?? 'No disponible'}>`,
	};
	static readonly TIMELINE_MESSAGE = {
		en: (config: GuildConfig) => `**Timeline Message ID:** ${config?.scheduleConfig?.timelineMessage ?? 'N/A'}`,
		pl: (config: GuildConfig) => `**ID wiadomości osi czasu:** ${config?.scheduleConfig?.timelineMessage ?? 'Brak'}`,
		de: (config: GuildConfig) => `**Nachrichten-ID der Zeitachse:** ${config?.scheduleConfig?.timelineMessage ?? 'Nicht verfügbar'}`,
		fr: (config: GuildConfig) => `**ID du message de chronologie :** ${config?.scheduleConfig?.timelineMessage ?? 'Indisponible'}`,
		es: (config: GuildConfig) => `**ID del mensaje de línea de tiempo:** ${config?.scheduleConfig?.timelineMessage ?? 'No disponible'}`,
	};
	static readonly TIMELINE_MESSAGE_ICON: Record<string, (config: GuildConfig) => string> = {
		en: (config) => `**Timeline Message Icon:** ${config?.scheduleConfig?.timelineMessageIcon}`,
		pl: (config) => `**Ikona Wiadomości na Osi Czasu:** ${config?.scheduleConfig?.timelineMessageIcon}`,
		de: (config) => `**Zeitachsen-Nachrichtensymbol:** ${config?.scheduleConfig?.timelineMessageIcon}`,
		fr: (config) => `**Icône du message chronologique:** ${config?.scheduleConfig?.timelineMessageIcon}`,
		es: (config) => `**Icono del mensaje en la línea de tiempo:** ${config?.scheduleConfig?.timelineMessageIcon}`,
	};
	static readonly MINUTES_BEFORE_TIMER = {
		en: (config: GuildConfig) => `**Minutes Before Timer:** ${config?.scheduleConfig?.minutesBeforeTimer ?? 'N/A'}`,
		pl: (config: GuildConfig) => `**Minuty przed czasomierzem:** ${config?.scheduleConfig?.minutesBeforeTimer ?? 'Brak'}`,
		de: (config: GuildConfig) => `**Minuten vor dem Timer:** ${config?.scheduleConfig?.minutesBeforeTimer ?? 'Nicht verfügbar'}`,
		fr: (config: GuildConfig) => `**Minutes avant le minuteur :** ${config?.scheduleConfig?.minutesBeforeTimer ?? 'Indisponible'}`,
		es: (config: GuildConfig) => `**Minutos antes del temporizador:** ${config?.scheduleConfig?.minutesBeforeTimer ?? 'No disponible'}`,
	};

	static readonly EDIT_ADMIN_ROLE_PROMPT: Record<string, string> = {
		en: 'Edit Admin Role',
		pl: 'Edytuj rolę administratora',
		de: 'Admin-Rolle bearbeiten',
		fr: 'Modifier rôle admin',
		es: 'Editar rol admin',
	};
	static readonly EDIT_COMMAND_CHANNEL_PROMPT: Record<string, string> = {
		en: 'Edit Command Channel',
		pl: 'Edytuj kanał komend',
		de: 'Befehlskanal bearbeiten',
		fr: 'Modifier canal de commande',
		es: 'Editar canal de comandos',
	};
	static readonly EDIT_SCHEDULE_CHANNEL_PROMPT: Record<string, string> = {
		en: 'Edit Schedule Channel',
		pl: 'Edytuj kanał harmonogramu',
		de: 'Zeitplankanal bearbeiten',
		fr: 'Modifier canal de calendrier',
		es: 'Editar canal de horario',
	};
	static readonly EDIT_TIMELINE_CHANNEL_PROMPT: Record<string, string> = {
		en: 'Edit Timeline Channel',
		pl: 'Edytuj kanał osi czasu',
		de: 'Zeitachsenkanal bearbeiten',
		fr: 'Modifier canal de chronologie',
		es: 'Editar canal de línea de tiempo',
	};
	static readonly EDIT_MINUTES_BEFORE_TIMER_PROMPT: Record<string, string> = {
		en: 'Edit Minutes Before Timer',
		pl: 'Edytuj minuty przed czasomierzem',
		de: 'Minuten vor Timer bearbeiten',
		fr: 'Modifier minutes avant minuteur',
		es: 'Editar minutos antes del temporizador',
	};
	static readonly ENTER_MINUTES_PROMPT: Record<string, string> = {
		en: 'Enter number of minutes (e.g., >0)',
		pl: 'Wprowadź liczbę minut (np. >0)',
		de: 'Gib die Anzahl der Minuten ein (z. B. >0)',
		fr: 'Entrez le nombre de minutes (par exemple, >0)',
		es: 'Introduce el número de minutos (p. ej., >0)',
	};
	static readonly SELECT_TEXT_CHANNEL_PROMPT: Record<string, string> = {
		en: "Please select a text channel.",
		pl: "Proszę wybierz kanał tekstowy.",
		de: "Bitte wähle einen Textkanal.",
		fr: "Veuillez sélectionner un canal textuel.",
		es: "Por favor, selecciona un canal de texto.",
	};
	static readonly EDIT_TIMELINE_MESSAGE_ICON_PROMPT: Record<string, string> = {
		en: 'Edit Timeline Message Icon',
		pl: 'Edytuj ikonę wiadomości na osi czasu',
		de: 'Symbol der Zeitachsen-Nachricht bearbeiten',
		fr: "Modifier l'icône du message chronologique",
		es: 'Editar el icono del mensaje de la línea de tiempo',
	};
	static readonly URL_SUCCESS = {
		en: (url: string) => `Successfully set Icon to: ${url}`,
		pl: (url: string) => `Pomyślnie ustawiono ikonę na: ${url}`,
		de: (url: string) => `Symbol erfolgreich gesetzt auf: ${url}`,
		fr: (url: string) => `Icône définie avec succès sur : ${url}`,
		es: (url: string) => `Icono establecido correctamente en: ${url}`,
	};
	static readonly TIMER_SUCCESS = {
		en: (message: number) => `Successfully set timer to: ${message}`,
		pl: (message: number) => `Pomyślnie ustawiono timer na: ${message}`,
		de: (message: number) => `Timer erfolgreich eingestellt auf: ${message}`,
		fr: (message: number) => `Minuteur réglé avec succès sur : ${message}`,
		es: (message: number) => `Temporizador establecido con éxito en: ${message}`,
	};

	static readonly JOIN_MISSION: Record<string, (mission: Mission) => string> = {
		en: (mission: Mission) => `Successfully marked you as joining the mission: ${mission.opName}!`,
		pl: (mission: Mission) => `Pomyślnie oznaczono cię jako dołączającego do misji: ${mission.opName}!`,
		de: (mission: Mission) => `Du wurdest erfolgreich als Teilnehmer an der Mission ${mission.opName} markiert!`,
		fr: (mission: Mission) => `Vous avez été marqué comme participant à la mission ${mission.opName} avec succès !`,
		es: (mission: Mission) => `¡Te hemos marcado como participante en la misión ${mission.opName} con éxito!`
	};
	static readonly MAYBE_MISSION: Record<string, (mission: Mission) => string> = {
		en: (mission: Mission) => `Marked you as maybe joining the mission: ${mission.opName}.`,
		pl: (mission: Mission) => `Oznaczono cię jako być może dołączającego do misji: ${mission.opName}.`,
		de: (mission: Mission) => `Du wurdest als möglicherweise teilnehmend an der Mission ${mission.opName} markiert.`,
		fr: (mission: Mission) => `Vous avez été marqué comme peut-être participant à la mission ${mission.opName}.`,
		es: (mission: Mission) => `Te hemos marcado como quizás participando en la misión ${mission.opName}.`
	};
	static readonly NOT_JOINING_MISSION: Record<string, (mission: Mission) => string> = {
		en: (mission: Mission) => `Marked you as not joining the mission: ${mission.opName}.`,
		pl: (mission: Mission) => `Oznaczono cię jako nie dołączającego do misji: ${mission.opName}.`,
		de: (mission: Mission) => `Du wurdest als nicht teilnehmend an der Mission ${mission.opName} markiert.`,
		fr: (mission: Mission) => `Vous avez été marqué comme ne participant pas à la mission ${mission.opName}.`,
		es: (mission: Mission) => `Te hemos marcado como no participando en la misión ${mission.opName}.`
	};

	static readonly NO_PERMS: Record<string, string> = {
		en: '❌ You do not have permission to use this.',
		pl: '❌ Nie masz uprawnień, aby tego użyć.',
		de: '❌ Du hast keine Berechtigung, dies zu verwenden.',
		fr: '❌ Vous n’avez pas la permission d’utiliser ceci.',
		es: '❌ No tienes permiso para usar esto.',
	};

	static get(message: Record<string, string>, locale: string): string;

	static get<T>(message: Record<string, (arg: T) => string>, locale: string, arg: T): string;

	static get(message: any, locale: string, arg?: any): string {
		const msg = message[locale] ?? message['en'];
		return typeof msg === 'function' ? msg(arg) : msg;
	}
}
