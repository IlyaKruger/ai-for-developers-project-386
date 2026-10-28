# Changelog

## 1.0.0 (2026-10-28)


### Features

* add Docker support and production build ([ddc68bd](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/ddc68bdcd5a7af137581866477867e25eee100ce))
* **backend:** add BOOKING_STEP_MINUTES configurable slot step ([a16b898](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/a16b898fee164756eeaf4fcaddf33d43bfb566cc)), closes [#17](https://github.com/IlyaKruger/ai-for-developers-project-386/issues/17)
* implement booking application with TypeSpec contract and Hono backend ([51968f3](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/51968f3e2d32e99e84d81e206322c7a4058fe11a))
* scaffold calendar booking service ([f33993b](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/f33993b8d2c97282636e3060c536267f79512840))
* **slots:** add Slot/Booking types and derived availability logic ([89dfd87](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/89dfd8796fe2aad194c99a2beaf3d719b2192fd9))
* **ui:** add public booking page with slot list and booking form ([e720b2b](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/e720b2b92672474cde82d37b6a8cafdfa811f7f1))
* гибкое расписание по дням недели (WeeklySchedule) ([d1814d9](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/d1814d9a18dd127866183f405939507ab5899b04))


### Bug Fixes

* **ci:** upgrade generate-check to Node 22 (fs/promises.glob requires Node 22+) ([563fc2f](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/563fc2f3a1a512ee9fc6845331e51ed7e7ea772f))
* **e2e:** fix stale host page h1 assertion and ambiguous locator ([733c778](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/733c77826f7f56ba53a9cf1c2b5e9a5e48ed7ea5))
* **frontend:** fix TS errors blocking Docker build ([fac7c58](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/fac7c58a5c0a0905606810e0186411570032a4c6))
* **slots:** use &gt;= for past-slot check and rename single-letter params ([eed4d05](https://github.com/IlyaKruger/ai-for-developers-project-386/commit/eed4d05d91da2b6c3bab94764cbbe3b2b13db396))
