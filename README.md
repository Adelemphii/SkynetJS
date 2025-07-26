# Skynet Discord Bot

Skynet is a feature-rich, TypeScript-based Discord bot focused on per-server configuration, localized messaging, and interaction-driven admin control. Built with `discord.js`, it provides an extensible and organized way to manage your server's roles, channels, and scheduled actions.

## 🌟 Features

- ✅ Per-server settings (admin role, command channel, schedule channel, etc.)
- 🌐 Locale support (`en`, `pl`, `de`, `fr`, `es`)
- ⚙️ Dynamic interaction-based configuration (select menus, modals, buttons)
- 🔐 Permission-based access (admin role checks per event)
- 🧱 Modular architecture with clean separation of concerns
- 📅 Timer system with configurable minute offset
- 🧪 Built with TypeScript and strong typing

## 📁 Project Structure

src/
├── commands/ # Slash command definitions
├── events/ # Discord.js event handlers
├── interaction/ # Custom interaction logic (menus, modals, etc.)
├── locale/ # Localization strings per language
├── objects/ # Data structures and DTOs
├── util/ # Utility functions and helpers
├── ScheduleConfig.ts # Manages server-specific schedule settings
└── GuildConfig.ts # Core server configuration class

## 🧰 Requirements

- Node.js 18+
- Discord bot token
- TypeScript (`tsc`)
- `discord.js` v14

## 🗺️ Localization

Skynet supports multiple languages. To add or edit a language, modify:

`src/locale/messages.ts`

Each message key maps to a localized string per language code (en, pl, de, etc.).

## 🔐 Permissions

Admin-only interactions check for the configured admin role, which can be set via the bot's UI using role select menus.

## 📜 Example Usage
    `/config — View current configuration`

## 🧪 Testing

You can test the bot by inviting it to a test server and using the configured admin role.

## 🤝 Contributing

Feel free to fork the project and open a pull request! Use conventional commits and include descriptions for major changes.
