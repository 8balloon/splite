# `splite`

splite is (hopefully going to be) a typesafe e2e distributed stream architecture allowing the realization of live queries (and, potentially, materialized views)

Project structure was initially based off of https://metachris.github.io/typescript-boilerplate/ / https://github.com/metachris/typescript-boilerplate

Splite is going to be relatively opinionated, at first. It will be built around:

- React hooks
- Express/Connect middleware (which should work fine with Next.js and Fastify)
- Prisma (ideally over CockroachDB)
- Redis (initially, and then a custom event hub)

Its design will be horizontally scalable.
