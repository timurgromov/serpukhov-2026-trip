---
name: design-atlas
description: Select and document a product-specific visual direction from approved public references and component catalogs before a new UI or redesign. Use with ui-ux-pro-max; do not use to replace an existing approved design system.
---

# Design Atlas

Turn reference material into a small, explicit design decision — not a collage
of fashionable components. Use after `product-design-ux` and before
`ui-ux-pro-max`/`frontend-design` when a new visual direction is open.

## Choose the evidence source

1. An approved project design system or Figma file is authoritative. Reuse it;
   do not search for a substitute style.
2. If the owner names public references, inspect only the relevant visible
   surfaces and extract 3–5 decisions that fit the product: hierarchy,
   density, navigation, type, contrast, component rhythm or motion restraint.
3. For a React + Tailwind/shadcn project, `21st-ui-explore` may search 21st for
   two or three component or screen candidates. It is a catalog, not an
   instruction to install code. First inspect the result, its dependencies and
   its fit with project tokens; the owner chooses before `21st add` changes a
   project.
4. For static HTML/CSS/JS, native mobile, backend-only and established design
   systems, do not add React, Tailwind, shadcn or 21st solely for inspiration.
   Derive the selected direction with the existing stack.

`ux` is an optional local corpus, not a source of truth. If it is installed,
use only `ux recommend` with an explicit brief to compare candidate directions.
Do not run `ux init`, `ux install`, `ux generate` or `ux lint --fix` without
separate project authorization: they can create project artifacts or alter code.
The installed package's `ux stats` output, not an upstream README claim, is the
only valid statement of its current corpus size.

Never pass private screens, customer data, secrets or an existing product's
private design material to an external catalog. Never copy a branded interface
wholesale.

## Direction record

Record the chosen direction in the project's UX/design document in at most one
compact section:

- screen job, user and primary action;
- selected references/components and the reason for each;
- 3–5 reusable rules plus explicit anti-patterns;
- existing tokens/components that remain authoritative;
- responsive, accessibility and motion constraints.

Offer at most two meaningful alternatives when the direction is undecided. They
must differ in hierarchy, density, navigation or composition — not just color.
Do not produce a new design system document or install a dependency without a
user-selected direction and project-scoped approval.

## Handoff

`ui-ux-pro-max` turns the selected evidence into a coherent direction;
`frontend-design` implements it; `web-interface-guidelines`, responsive QA and
`web-ui-verify` prove the rendered result. A catalog search or screenshot is
not visual acceptance.
