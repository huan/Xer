# Xer [![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://wechaty.js.org) [![Node.js CI](https://github.com/xjiang67/Xer/actions/workflows/node.js.yml/badge.svg)](https://github.com/xjiang67/Xer/actions/workflows/node.js.yml)

Xer is a dating bot target for getting more conversions from online dating apps

## Development

The Conversational State Machine is at: <https://github.com/xjiang67/Xer/blob/main/src/conversational-state-machine/machine.ts>

1. Start from this file and keep all logics inside it.
1. Other files should be all treat as **Library**.

## Architecture

Xer is a conversational application built on [Wechaty](https://github.com/wechaty/wechaty). It uses the following design patterns:

- [Domain-driven Design (DDD)](https://medium.com/raa-labs/part-1-domain-driven-design-like-a-pro-f9e78d081f10)
- [Event Storming](https://virtualddd.com/learning-ddd/ddd-crew-eventstorming-glossary-cheat-sheet)
- [Event Sourcing](https://smartlabsblog.wordpress.com/2015/09/06/introduction-to-cqrs-and-event-sourcing-part-1/)
- [Command Query Responsibility Segregation (CQRS)](https://www.sderosiaux.com/articles/2019/08/29/cqrs-why-and-all-the-things-to-consider/)
- [Actor Model](https://en.wikipedia.org/wiki/Actor_model)

## Requirements

- [Node.js](https://nodejs.org/en/) v16+
- [NPM](https://www.npm.com/) v8+

[NVM](https://nvm.sh/) is recommended to install and manage the versions of Node.js and NPM.

## Installation

```bash
npm install
```

## Usage

```bash
npm start
```

If you want to run Xer with WhatsApp, you need to set the environment variable `WECHATY_PUPPET` to `wechaty-puppet-whatsapp`.

```sh
WECHATY_PUPPET=wechaty-puppet-whatsapp npm start
```

## Tests

```bash
npm test
```

## Resoueces

1. [Conversational RPA SDK: Wechaty](https://wechaty.js.org)
1. [Wechaty: 6 行代码构建基于 Whatsapp 和个人微信的对话式人机交互界面应用, Huan, Jul 22, 2021](https://wechaty.js.org/2021/07/22/gdg-shanghai-wechaty/)
1. [Refactoring Friday BOT with NestJS, Domain-driven Design (DDD), and CQRS, Huan, Feb 27, 2022](https://wechaty.js.org/2022/02/27/refactoring-friday-bot-with-nestjs-ddd-cqrs/)
1. [Event-driven Programming with CQRS Wechaty, Huan, Mar 17, 2022](https://wechaty.js.org/2022/03/17/event-driven-wechaty-cqrs/)

## Authors

- Xuan Jiang - Initial work - @[xjiang67](https://github.com/xjiang67)
- Huan Li - Initial work - @[huan](https://github.com/huan)
