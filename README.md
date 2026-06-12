# Repro: expo-router `Link.Preview` removes the wrapped subtree from the iOS accessibility tree

Minimal reproduction for an expo-router bug on iOS: wrapping a row in
`<Link.Trigger>` with a sibling `<Link.Preview />` makes the **entire wrapped
subtree invisible to the iOS accessibility tree** — VoiceOver cannot focus it
and XCUITest-based tools (Appium, Maestro, Detox, the Accessibility Inspector)
cannot see it, even when the trigger child has an explicit
`accessibilityLabel` and `testID`.

## Setup

```sh
npm install
npx expo run:ios
```

## What the app renders

[`src/app/index.tsx`](src/app/index.tsx) renders two visually identical rows:

- **Row A** — plain `<Link asChild><Pressable …>` (control)
- **Row B** — the same structure wrapped in `<Link.Trigger>` with a sibling
  `<Link.Preview />`

Both Pressables have an `accessibilityLabel` and a `testID`.

## Expected

Both rows are exposed to the accessibility tree: VoiceOver can focus each row,
and an XCUITest hierarchy dump shows both labels/identifiers.

## Actual

Only Row A is exposed. Row B — the whole subtree behind `Link.Trigger` /
`Link.Preview`, including its text — is missing entirely:

- VoiceOver skips the row (it cannot be focused at all).
- An XCUITest hierarchy dump (e.g. `maestro hierarchy`, or
  `XCUIApplication().debugDescription`) contains `row-plain-link` and Row A's
  text, but no `row-with-preview` and none of Row B's content.

The row still works for sighted touch users (tap navigates, long-press shows
the preview) — it is only assistive tech and UI-test tooling that lose it.

## Why this matters

Any list that adopts `Link.Preview` for native peek-previews becomes
completely unusable with VoiceOver, and untestable with every XCUITest-based
E2E framework. We had to remove `Link.Preview`/`Link.Menu` from our app's list
rows after our accessibility/E2E run found every list row missing.

## Environment

- Expo SDK 56 (`expo@56.0.11`, `expo-router@56.2.10`) — also reproduced on
  `expo-router@56.2.8`
- iOS 26.5 simulator (iPhone 17), Xcode 26.5 — also reproduced on iOS 26.1
- New Architecture (SDK 56 default)
