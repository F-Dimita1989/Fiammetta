# Energy Efficiency & Heating Curves

## Condensing Boiler Efficiency

Modern condensing boilers achieve high efficiency (100%+) only when they operate in **condensing mode**.

- **Condition**: Return water temperature must be below the "dew point" of natural gas exhaust (approx **55°C**).
- **Strategy**: Keep the flow temperature (T_set) as low as possible while maintaining comfort.

## Outdoor Reset (Weather Compensation)

Instead of a fixed T_set (e.g., 70°C), use an "Outdoor Reset Curve":

- **Cold Day (-5°C)** -> High Flow Temp (65°C)
- **Mild Day (12°C)** -> Low Flow Temp (40°C)

This ensures the boiler runs cooler on mild days, maximizing condensation and saving up to **15-20% gas**.

## PID Tuning Tips

If the boiler cycles on/off too frequently ("Targeting"), the PID parameters need tuning:

- **Overshoot** (Room gets too hot): Decrease Kp (Proportional gain).
- **Slow Response** (Room takes forever to heat): Increase Kp.
- **Oscillation** (Temperature waves): Decrease Ki (Integral gain) or increase Kd (Derivative).

## Hydraulic Balancing

Radiators must be balanced so they heat up evenly.

- **Cold bottom of radiator**: Normal for good efficiency (heat extraction).
- **Cold top**: Air is trapped -> **Bleed the radiator**.
