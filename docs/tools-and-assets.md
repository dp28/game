# Tools and assets

## Recommended stack

Use **Expo + React Native + TypeScript**.

Reasons:

- It matches web-development skills better than Unity, Unreal, or native iOS/Android.
- It supports iOS, Android, and optional web preview from one codebase.
- It works well for a card/map/text-heavy strategy game.
- It avoids server requirements.
- It keeps AI-generated code reviewable because most logic can live in pure TypeScript modules.

Godot is a strong game engine, but for this specific project it adds new editor workflows, GDScript
or C#, and more mobile build complexity. React Native is the conservative choice for the stated time
budget and existing skills.

## Free development tools

- **VS Code or Cursor:** coding and AI-assisted iteration.
- **Expo Go:** fast device previews during development.
- **Android Studio:** Android emulator and local Android builds.
- **Xcode:** iOS simulator and iOS builds; requires macOS.
- **GitHub Actions:** CI for linting, type-checking, and tests.
- **Jest:** tests for the game engine.
- **ESLint + Prettier:** code quality and formatting.

## Store and build constraints

- Apple App Store publishing requires an Apple Developer Program membership, usually USD $99/year.
- Google Play publishing requires a Google Play Console registration fee, usually USD $25 one-time.
- iOS native builds require macOS somewhere in the build chain.
- Expo Application Services can help with cloud builds, but relying on it may introduce service
  limits or costs. The project should remain buildable locally.

## Free AI-assisted asset options

The current prototype does not need high-end art. Prefer a restrained board-game style:

- parchment cards
- simple heraldic icons
- flat map regions
- serif/sans typography
- limited color palette

Useful free or free-tier tools:

- **Bing Image Creator / Microsoft Designer:** app icon concepts, card art, heraldic symbols.
- **Leonardo AI free tier:** stylized map and icon concepts.
- **Stable Diffusion via free local tools:** full control if you have a capable machine.
- **Inkscape:** clean up generated SVG-style icons.
- **Figma free tier:** compose screenshots, store graphics, and simple UI mockups.
- **Game-icons.net:** free SVG icons under CC BY 3.0; attribution required.
- **OpenGameArt.org:** public/free game assets; check each asset license carefully.
- **Wikimedia Commons:** historical public-domain art; check jurisdiction and license.

Suggested prompt for icons:

```text
Minimal flat vector icon for a mobile historical strategy game, late medieval Renaissance state
formation, parchment and dark green palette, simple heraldic mark, readable at app icon size, no text
```

Suggested prompt for map texture:

```text
Simple board game map of a fictional Renaissance border realm, three provinces, parchment texture,
muted greens and browns, clean mobile UI style, no labels, no text
```

## Asset rules for this project

1. Avoid art that is hard to license.
2. Prefer SVG or simple generated PNG assets.
3. Keep the UI playable without final art.
4. Store prompts and source/license notes beside committed assets.
5. Do not add large binary files unless they are final release assets.
