# Troubleshooting OpenTherm Systems

## Common Issues and Solutions

### 1. Boiler Lockout (Error State)

The boiler has stopped for safety.

- **Check 1**: Water Pressure. Is it between 1.0 and 1.5 bar? If < 0.8, fill lines.
- **Check 2**: Gas Supply. Is the valve open?
- **Check 3**: Overheat. Did the pump fail? Reset the boiler manually.

### 2. No Communication (OpenTherm Gateway)

Thermostat shows "Conn Err" or similar.

- **Wiring**: OpenTherm is distinct from On/Off. Ensure wires are in the correct terminals (OT uses 2 specific low-voltage wires, polarity usually doesn't matter but check manual).
- **Cable Length**: Maximum 50 meters standard twisted pair.
- **Gateway Power**: Is the ESPHome/Tasmota gateway powered?

### 3. Radiators not getting hot

- **Thermostatic Valves (TRVs)**: Are they stuck closed? Pin might need lubrication.
- **Pump Speed**: If only logic is correct but flow is low, pump speed might be too low.
- **Air in system**: Bleed radiators starting from the highest point in the house.

## Diagnostic Logs

When debugging via Home Assistant, look for:

- `binary_sensor.boiler_flame`: Does it toggle frequently? (Short cycling)
- `sensor.boiler_modulation`: Is it stuck at 0% or 100%?
- `sensor.boiler_return_temp`: If Return equals Flow temp, there is no heat exchange (pump failure or all valves closed).
