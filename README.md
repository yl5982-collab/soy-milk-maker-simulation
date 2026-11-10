# Inside the Soy Milk Maker

An educational HTML/CSS/JavaScript model for Week 9. Open dist/index.html directly or serve dist with any static HTTP server. No build or installation is required.

## Interaction

Align the lid, then press Function repeatedly to cycle Soy Milk, Rice Paste, Boil Water, Juice, Keep Warm, and Cleaning. Waiting two seconds starts the selected program. Preset cycles 0/1/2/4 hours; delay and cooking follow the selected 1× / 60× / 120× speed. The two-second selection window remains real time. The display shows modeled minutes remaining, while the side display shows minutes:seconds. Mode-specific durations are illustrative placeholders (24 / 26 / 8 / 2 / 60 / 3 minutes), pending user confirmation. Stage divisions remain illustrative even after total durations are confirmed. Unplug interrupts any cycle. Reset restores the original demo.

Function/Cancel intentionally reproduces the user's report that a press during processing did not cancel. This is an observed interaction issue, not a claim that the actual device lacks any cancellation gesture. Internal algorithms and all temperatures are illustrative, not manufacturer recipes. Lid loss stops the model as an explicit safety assumption. Sensor values and ingredients are simulated. Extra photo labels Thick Soymilk and Complementary Food are outside this requested first-version scope.

## Learning map

- Variables/state: the `state` object in app.js.
- Form elements: buttons and the speed select.
- Event handling: click listeners at the end of app.js.
- Control flow: begin(), tick(), and the program stage arrays.
- Feedback: render() updates component activity, animations, labels, and display.

## Later redesign

Keep Version 1 separate. Version 2 can add sequential guided weighing, outcome-based texture selection, expandable explanations, explicit Start/Stop, and saved preferences. No redesign behavior is claimed as part of the original device.

