# Changelog

All notable changes to `@jatin_ux/garage`. New entries go under **Unreleased**; on release that
heading becomes the version number.

## 0.8.0 — Button, end to end

Press → wait → done was only half finished. Loading showed the wait; nothing said what happened after.

`feedback="success" | "error"` paints the button green or red, swaps the spinner for a check or a cross, and
announces the outcome. Clear it when you’re ready for the next press. `feedbackLabel` sets the wording.

Also: `fullWidth` stretches to the parent, and `disabledReason` explains a greyed-out button through `title` and
`aria-describedby` so the reason isn’t only visual.

`shape="sharp"` lands the hard corners next to `square` and `round` — same option on `GarageInput`.

## 0.7.0 — Input

### A field that belongs in a form

Toolbar chrome was ahead of the text field. Heights drifted. Focus colours disagreed. The line you
type into still looked borrowed from somewhere else.

`GarageInput` ships with the shared size scale, colour tokens and corner language. Focus only shows
in the border, ring and caret — at rest every input looks quiet. Clear, prefix, suffix, loading and
error states sit on top without inventing a second system.

One release. One job. Make the field feel native to the kit.

## 0.6.0

### Sound and the last mile

A press you can see still felt unfinished without a click you can hear. Soft, short, and easy to
turn off. `playButtonSound` and the reduced-motion hook land here so demos and products share the
same manners.

Also: README prop tables, the MIT license in the tarball, and package metadata that points at the
right homepage and issues.

## 0.5.0

### Loading without a layout jump

`loading` keeps the label width and swaps in a spinner. Icon-only buttons get the same treatment.
`loadingLabel` announces the wait. The button stops being a dead rectangle while the network thinks.

## 0.4.0

### Colour and shape as props

Five colours (`accent`, `blue`, `red`, `amber`, `black`) and two shapes (`square`, `round`). Light
and dark themes. The solid / soft / ghost / outline set finally has somewhere to go when a form
needs more than one tone.

## 0.3.0

### The press has to feel physical

Scale alone read as a glitch below about 0.9. Shadow carries as much of the press as the motion.
Touch gets a minimum press window and a short haptic so a tap does not vanish between frames.

`pressed`, `simulateTouch` and `reducedMotion` land for demos that need to show the state without
lying about the system preference.

## 0.2.0

### Four ways to start an action

`solid`, `soft`, `ghost`, `outline` — same height metrics, different weight. Prefix and suffix slots.
`render` for links. Disabled stays discoverable through `aria-disabled`.

Still just the button. Still one API.

## 0.1.0 — Version one

### The idea

Most product buttons are a rectangle and a hover. The brief was smaller than that: a press should
feel decided. Depth, settling, and enough states to survive a real toolbar.

### What shipped

`GarageButton` with size, variant, and the spring that settles in one bounce — or none. That was
version one. Small on purpose.
