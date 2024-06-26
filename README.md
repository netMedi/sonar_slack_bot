# sonar_slack_bot

## Requirements

- bash
- bun
- dotenvx
- podman/docker (for local containered run)
- secret_tool (for development only)

## Install

```bash
secret_tool local # extract secrets`
npm install
```

## Run

```bash
bun run dev:start # to start Slack bot (WIP)

bun run dev:cli # to start a CLI app for queries
```

## Docker/Podman (Cloud)

```bash
# replace "podman" with "docker" in the below commands, if you need
podman build -t awesome_sonar_slack_bot_image -f ./Containerfile .
podman run --name sonar-slack-bot -it awesome_sonar_slack_bot_image
```

## Compose (local)

```bash
# replace "podman" with "docker" in the below commands, if you need
podman-compose up -d # omit -d if you want compose to run in the foreground

# do your thing with the bot
# ...

podman-compose down
```
