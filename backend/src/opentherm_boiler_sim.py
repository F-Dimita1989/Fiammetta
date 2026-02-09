import socket
import time
import threading
import random


class BoilerState:
    def __init__(self):
        self.ch_enabled = True
        self.flame_on = False
        self.setpoint = 60.0
        self.water_temp = 40.0
        self.pressure = 1.5
        self.last_update = time.time()

    def update(self):
        now = time.time()
        dt = now - self.last_update
        self.last_update = now

        if self.ch_enabled and self.water_temp < self.setpoint - 1:
            self.flame_on = True
        elif not self.ch_enabled or self.water_temp >= self.setpoint:
            self.flame_on = False

        noise = random.uniform(-0.05, 0.05)
        if self.flame_on:
            self.water_temp += 0.3 * dt + noise
        else:
            self.water_temp -= 0.1 * dt + noise

        self.water_temp = max(20.0, min(self.water_temp, self.setpoint))


def handle_command(cmd: str, state: BoilerState):
    if cmd.startswith("B0"):  # Status
        status = (1 if state.ch_enabled else 0) | (4 if state.flame_on else 0)
        return f"B0{status:02X}"
    if cmd.startswith("T0"):  # Enable
        state.ch_enabled = bool(int(cmd[2:], 16) & 1)
        return cmd
    if cmd.startswith("B12"):  # Pressure
        return f"B12{int(state.pressure * 256):04X}"
    return None


def main():
    state = BoilerState()

    def physics():
        while True:
            state.update()
            time.sleep(0.5)

    threading.Thread(target=physics, daemon=True).start()

    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 6638))
    server.listen(1)
    print("OpenTherm Boiler Simulator running on 6638")

    while True:
        try:
            conn, _ = server.accept()
            while True:
                data = conn.recv(1024)
                if not data:
                    break
                resp = handle_command(data.decode().strip(), state)
                if resp:
                    conn.sendall((resp + "\r\n").encode())
        except Exception:
            pass


if __name__ == "__main__":
    main()
