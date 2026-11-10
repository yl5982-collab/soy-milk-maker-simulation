# Porridge your way — Version 2

A separate redesign prototype. Version 1 remains unchanged.

Open dist/index.html, or run `node server.cjs` and visit http://127.0.0.1:8767.

Choose a texture and serving size, optionally expand the process explanation and consistency controls, weigh rice then water using the simulated scale, align the lid, and explicitly start. Stop interrupts heating and blending. Completed cycles can be evaluated and saved under a name. Saved recipes persist in this browser through localStorage; loading restores preferences, never ingredient weights or an active program. Delete removes a saved recipe.

Soft grains uses no blade blending; Gentle porridge adds short pulses after cooking; Smooth paste adds longer continuous blending. Water ratios vary independently with consistency. Two servings extend heating, not every stage. These are illustrative choices, not validated recipes or swallowing-safety settings.

Simulation variables include page, texture, servings, thickness, ingredient, weight, rice, water, lid, status, temperature, elapsed time, stage, heater, motor, and particle reduction. Event listeners respond to form controls. State rules prevent starting with a misaligned lid or incomplete weighing and distinguish stopped from complete.

Not included: actual sensor integration, medical texture assessment, automatic ingredient recognition, or synchronization across devices. Exact-weight confirmation is a simplified teaching interaction. Recipe numbers and times are prototype assumptions.
