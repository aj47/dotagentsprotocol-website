# .agents Protocol

An open directory convention for AI agent configuration. One place for MCP tools, AGENTS.md instructions, Skills, Sub-Agents, Tasks, Memories, and model config — in plain, version-controllable files.

**Website:** [dotagentsprotocol.com](https://dotagentsprotocol.com)

## Directory Structure

```
.agents/
├── agents.md              # instructions (AGENTS.md compatible)
├── system-prompt.md       # system prompt
├── mcp.json               # MCP server configuration
├── models.json            # model presets & provider keys
├── skills/
│   └── code-review/
│       └── skill.md       # skill definition
├── agents/
│   └── code-reviewer/
│       ├── agent.md       # sub-agent profile + system prompt
│       └── config.json    # tool/model/connection config
├── tasks/
│   └── daily-code-review/
│       └── task.md        # repeat task definition
└── memories/
    └── project-arch.md    # persistent memory
```

## Layered Configuration

Two layers with overlay semantics. Workspace overrides global.

| Layer | Path | Purpose |
|-------|------|---------|
| **Global** | `~/.agents/` | Base config shared across all projects |
| **Workspace** | `<project>/.agents/` | Project-specific overrides, committed to git |

**Merge order:** `defaults` ← `config.json` ← `~/.agents` ← `./.agents`

- JSON files: shallow-merge by key
- Skills, agents, tasks, memories: merge by ID (workspace wins)

## Seven Open Standards

| Standard | Steward | Maps to | Purpose |
|----------|---------|---------|---------|
| [MCP](https://modelcontextprotocol.io) | Anthropic · Linux Foundation | `mcp.json` | Connect AI to external tools and data |
| [AGENTS.md](https://agents.md) | OpenAI · Linux Foundation | `agents.md` | Markdown instructions for coding agents |
| [Skills](https://docs.anthropic.com/en/docs/agents-and-tools/agent-skills) | Anthropic | `skills/*/skill.md` | Codified procedural knowledge |
| [ACP](https://zed.dev/acp) | Zed Industries | agent profiles | Agent-to-editor communication |
| Sub-Agents | .agents protocol | `agents/*/agent.md` | Declarative sub-agent profiles |
| Tasks | .agents protocol | `tasks/*/task.md` | Scheduled repeat tasks |
| Memories | .agents protocol | `memories/*.md` | Persistent agent memory |

## File Formats

All content files use **frontmatter + markdown body**. Config files use **plain JSON**. No YAML dependency.

### skill.md

```markdown
---
id: code-review
name: Code Review Expert
description: Thorough code review
enabled: true
---

Review code changes for:
- Security vulnerabilities
- Performance implications
- Test coverage gaps
```

### agent.md (Sub-Agent Profile)

```markdown
---
id: code-reviewer
name: Code Reviewer
description: Reviews code for security and quality
role: delegation-target
enabled: true
connection-type: internal
---

You are a code review specialist. Focus on:
- Security vulnerabilities
- Performance implications
- Test coverage gaps
```

### config.json (Sub-Agent Config)

```json
{
  "toolConfig": {
    "disabledServers": ["filesystem"],
    "enabledBuiltinTools": ["mark_work_complete"]
  },
  "modelConfig": {
    "mcpToolsProviderId": "openai",
    "mcpToolsOpenaiModel": "gpt-4o"
  },
  "connection": {
    "type": "stdio",
    "command": "my-agent",
    "args": ["--mode", "review"]
  }
}
```

### task.md (Repeat Task)

```markdown
---
kind: task
id: daily-code-review
name: Daily Code Review
intervalMinutes: 60
enabled: true
runOnStartup: false
profileId: abc-123
---

Review all open pull requests and summarize their status.
Check for any failing CI pipelines and report issues.
```

### memory.md

```markdown
---
id: arch_001
title: Database Architecture
content: PostgreSQL with Drizzle ORM
importance: high
tags: database, architecture, orm
---

We chose PostgreSQL over MongoDB for
relational data integrity and complex
query support across billing.
```

## Design Principles

| Principle | Rationale |
|-----------|-----------|
| **Human-readable** | Plain JSON and Markdown only. No binary formats, no proprietary schemas. |
| **Version-controllable** | Deterministic key sorting for clean diffs. Commit entire agent config to git. |
| **Portable** | Relative paths, no vendor lock-in. Share as profile packs, transfer between machines. |
| **Safe by default** | Atomic writes (temp+rename). Timestamped backups with rotation. Auto-recovery from parse failures. |
| **Layered** | Global defaults at `~/.agents`, workspace overrides at `./.agents`. |
| **Extensible** | Add new config files without breaking existing ones. Simple frontmatter avoids YAML dependency bloat. |

## Getting Started

```bash
# Global (shared across all projects)
mkdir -p ~/.agents/skills ~/.agents/agents ~/.agents/tasks ~/.agents/memories

# Workspace (project-specific overrides)
mkdir -p .agents/skills .agents/agents .agents/tasks .agents/memories
```

Add what you need incrementally — an `agents.md` for guidelines, `mcp.json` for tools, skills for procedures, sub-agents for delegation, tasks for automation, memories for persistence. Commit `.agents/` to git and share with your team.

## Contributing

This specification is a draft. The protocol is open and evolving. If you're building AI tools, managing agents, or want portable config — contributions are welcome.

- [GitHub](https://github.com/aj47/dotagentsprotocol-website)
- [Discord](https://discord.gg/speakmcp)

## License

MIT
