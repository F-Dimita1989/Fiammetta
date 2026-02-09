# Home Assistant Automations for Climate

## Smart Heating Automation

This example shows how to automate the OpenTherm thermostat based on presence and time.

### 1. Away Mode (Eco)

Automatically lower temperature when no one is home.

```yaml
alias: "Heating: Away Mode"
description: "Set Eco temperature when house is empty"
trigger:
  - platform: state
    entity_id: zone.home
    to: "0" # No people in zone
condition: []
action:
  - service: climate.set_temperature
    target:
      entity_id: climate.opentherm_thermostat
    data:
      temperature: 16.0
      hvac_mode: "auto"
```

### 2. Morning Boost

Pre-heat the house before waking up.

```yaml
alias: "Heating: Morning Boost"
trigger:
  - platform: time
    at: "06:30:00"
condition:
  - condition: state
    entity_id: binary_sensor.workday_sensor
    state: "on"
action:
  - service: climate.set_temperature
    target:
      entity_id: climate.opentherm_thermostat
    data:
      temperature: 20.5
```

### 3. Open Window Detection

Turn off heating if temperature drops rapidly (virtual sensor logic).

```yaml
alias: "Heating: Window Open Detected"
trigger:
  - platform: trend
    entity_id: sensor.living_room_temperature
    sample_duration: 600
    min_gradient: -0.01 # Sudden drop
action:
  - service: climate.set_hvac_mode
    target:
      entity_id: climate.opentherm_thermostat
    data:
      hvac_mode: "off"
  - service: notify.mobile_app
    data:
      message: "Heating stopped: Window likely open."
```
