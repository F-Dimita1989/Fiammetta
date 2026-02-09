# OpenTherm and Boiler Control

## Basics of OpenTherm

OpenTherm is a standard communications protocol used in central heating systems to communicate between a central heating boiler and a thermostatic controller.
Unlike traditional ON/OFF thermostats, OpenTherm allows for **Modulation**: the boiler can adjust its heating power (e.g., from 0% to 100%) rather than just cycling on and off. This improves efficiency and comfort.

## Key Parameters

- **T_set (Setuppoint)**: The target water temperature the boiler should achieve.
- **T_room (Room Temperature)**: Current temperature in the room.
- **Modulation Level**: The percentage of burner capacity currently in use.
- **Water Pressure**: Typically should be between 1.0 and 2.0 bar. Low pressure (<0.8 bar) can cause lockouts.

## Control Strategies

### Hysteresis (On/Off)

- Simple logic: If T_room < Target, turn ON. If T_room > Target, turn OFF.
- Pros: Simple. Cons: Temperature swings, overshoot.

### PID Control (Proportional-Integral-Derivative)

- Calculates an error value as the difference between a desired setpoint and a measured process variable.
- **P (Proportional)**: Reacts to current error.
- **I (Integral)**: Reacts to accumulation of past errors (fixes steady-state error).
- **D (Derivative)**: Reacts to rate of change (predicts future error).
- Used in OpenTherm boilers to calculate the exact `T_set` needed to maintain stable `T_room`.
