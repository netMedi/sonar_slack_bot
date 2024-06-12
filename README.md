# sonar_slack_bot

## Requirements

- bash
- bun
- secret_tool (for development only)

## Install

```bash
secret_tool local # extract secrets`
bun install
```

## Run

```bash
bun run bot.ts
```

## Docker/Podman (Cloud)

```bash
podman build -t awesome_sonar_slack_bot_image -f ./Containerfile .
podman run -it awesome_sonar_slack_bot_image bun run bot.ts
```