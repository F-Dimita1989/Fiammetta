# Home Assistant Integration

## Overview

Home Assistant (HA) is an open-source home automation platform. It can integrate with custom devices using **MQTT** (Message Queuing Telemetry Transport).

## MQTT Discovery

To automatically register a device in Home Assistant without editing YAML configuration files, we use MQTT Discovery.
The device must send a configuration message to a specific topic.

### Structure

- **Discovery Topic**: `homeassistant/climate/[node_id]/config`
- **Component**: `climate` (for thermostats/boilers).

### Payload Example

```json
{
  "name": "Living Room Thermostat",
  "unique_id": "boiler_main_thermostat",
  "mode_cmd_t": "home/boiler/mode/set",
  "mode_stat_t": "home/boiler/mode",
  "temp_cmd_t": "home/boiler/target_temp/set",
  "temp_stat_t": "home/boiler/target_temp",
  "curr_temp_t": "home/boiler/current_temp",
  "min_temp": 10,
  "max_temp": 30,
  "modes": ["off", "heat", "auto"]
}
```

## Entity States

- **State Topics (\_stat_t)**: Where the device publishes its current status (e.g., current temp).
- **Command Topics (\_cmd_t)**: Where HA publishes commands (e.g., user changes target temp).
