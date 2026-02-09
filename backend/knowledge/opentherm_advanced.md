# Advanced OpenTherm Protocol Details

## Data ID Specifications

OpenTherm communicates via Data IDs. Here are the most critical ones for boiler control:

| ID     | Name              | Description                                                  | Read/Write |
| :----- | :---------------- | :----------------------------------------------------------- | :--------- |
| **0**  | Status            | Flag register (Fault, CH Active, DHW Active, Flame Status)   | R          |
| **1**  | TSet              | Control Setpoint (Temperature defined by thermostat)         | W          |
| **9**  | Remote Override   | Setpoint override from external source                       | W          |
| **14** | Max Modulation    | Maximum relative modulation level allowed                    | W          |
| **17** | Rel. Modulation   | Actual modulation level (0-100%)                             | R          |
| **25** | Boiler Water Temp | Flow temperature from boiler sensor                          | R          |
| **26** | DHW Temp          | Domestic Hot Water temperature                               | R          |
| **27** | Outside Temp      | External sensor temperature (for weather compensation)       | R          |
| **28** | Return Water Temp | Return water temperature (crucial for condensing efficiency) | R          |

## Status Byte Flags

The Status ID (0) contains bit-flags:

- **Bit 0**: Fault indication (1 = Failure)
- **Bit 1**: CH Mode (1 = Central Heating active)
- **Bit 2**: DHW Mode (1 = Domestic Hot Water active)
- **Bit 3**: Flame Status (1 = Burner on)

## Common OEM Error Codes

While standard OpenTherm reports a generic "Fault", specific OEM codes (ID 5) vary:

- **E01**: Ignition Failure (Check gas supply, electrodes)
- **E02**: Overheat Thermostat (Check circulation pump)
- **E03**: Flue Gas Probe / Fan issue
- **E10**: Low Water Pressure (< 0.5 bar)
- **E99**: Internal PCB Error
