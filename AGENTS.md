# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

- Keep `parseTagValue: false` on the `config.xml` model: numeric-looking API keys must remain strings.
- Apply passwords through `PUT /api/v1/config/host`, never a hand-written database hash. Lidarr uses the API's `v1` prefix independently of its application version.
