import socket
import threading
import time
import json
import paho.mqtt.client as mqtt

MQTT_BROKER = "127.0.0.1"
MQTT_PORT = 1883
BOILER_HOST = "127.0.0.1"
BOILER_PORT = 6638


def ot_to_float(hex_val):
    try:
        return int(hex_val, 16) / 256.0
    except:
        return 0.0


def send_boiler_cmd(sock, cmd):
    try:
        sock.sendall(cmd.encode())
        return sock.recv(1024).decode().strip()
    except:
        return ""


class SystemController:
    def __init__(self):
        self.state = {
            "room_temp": 19.0,
            "target_temp": 20.0,
            "heating_active": False,
            "boiler_pressure": 0.0,
            "mode": "heat",
            "history": [],
        }
        self.running = False
        self.sock = None
        self.client = None
        self.history_lock = threading.Lock()

    def start(self):
        self.running = True
        try:
            self.sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            self.sock.connect((BOILER_HOST, BOILER_PORT))
        except Exception:
            pass

        self.client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
        self.client.on_connect = self._on_connect
        self.client.on_message = self._on_mqtt_message

        try:
            self.client.connect(MQTT_BROKER, MQTT_PORT, 60)
            self.client.loop_start()
            self._publish_discovery()
        except Exception:
            pass

        threading.Thread(target=self._control_loop, daemon=True).start()

    def stop(self):
        self.running = False
        if self.client:
            self.client.loop_stop()
        if self.sock:
            self.sock.close()

    def _on_connect(self, client, userdata, flags, rc, properties=None):
        if rc == 0:
            client.subscribe("boiler/thermostat/set_temp")
            client.subscribe("boiler/thermostat/mode/set")

    def _on_mqtt_message(self, client, userdata, msg):
        try:
            val = msg.payload.decode()
            if msg.topic.endswith("set_temp"):
                self.state["target_temp"] = float(val)
            elif msg.topic.endswith("mode/set"):
                self.state["mode"] = val
        except ValueError:
            pass

    def _publish_discovery(self):
        # Home Assistant Discovery
        if not self.client:
            return

        # Climate
        self.client.publish(
            "homeassistant/climate/boiler_ai/config",
            json.dumps(
                {
                    "name": "AI Smart Thermostat",
                    "unique_id": "boiler_ai_climate",
                    "action_topic": "boiler/thermostat/action",
                    "current_temperature_topic": "boiler/thermostat/current_temp",
                    "temperature_command_topic": "boiler/thermostat/set_temp",
                    "temperature_state_topic": "boiler/thermostat/target_temp",
                    "mode_command_topic": "boiler/thermostat/mode/set",
                    "modes": ["off", "heat"],
                    "min_temp": 10,
                    "max_temp": 30,
                    "temp_step": 0.5,
                    "device": {
                        "identifiers": ["boiler_center"],
                        "name": "Boiler AI Controller",
                        "manufacturer": "Antigravity",
                    },
                }
            ),
            retain=True,
        )

        # Sensors
        self.client.publish(
            "homeassistant/sensor/boiler_pressure/config",
            json.dumps(
                {
                    "name": "Boiler Pressure",
                    "unique_id": "boiler_pressure",
                    "state_topic": "boiler/sensors/pressure",
                    "unit_of_measurement": "bar",
                    "device_class": "pressure",
                    "device": {"identifiers": ["boiler_center"]},
                }
            ),
            retain=True,
        )

    def _control_loop(self):
        last_hist = 0
        while self.running:
            # Physics
            tgt = self.state["target_temp"]
            curr = self.state["room_temp"]
            active = self.state["heating_active"]

            if self.state["mode"] == "heat":
                if curr < tgt - 0.2:
                    active = True
                elif curr > tgt + 0.2:
                    active = False
            else:
                active = False

            self.state["heating_active"] = active
            self.state["room_temp"] += 0.01 if active else -0.005

            # IO
            if self.sock:
                send_boiler_cmd(self.sock, "T001" if active else "T000")
                resp = send_boiler_cmd(self.sock, "B12")
                if resp.startswith("B12"):
                    self.state["boiler_pressure"] = ot_to_float(resp[3:])

            if self.client:
                self.client.publish(
                    "boiler/thermostat/current_temp", f"{self.state['room_temp']:.1f}"
                )
                self.client.publish(
                    "boiler/thermostat/target_temp", f"{self.state['target_temp']:.1f}"
                )
                self.client.publish(
                    "boiler/thermostat/action", "heating" if active else "idle"
                )
                self.client.publish(
                    "boiler/sensors/pressure", f"{self.state['boiler_pressure']:.2f}"
                )

            # History
            now = time.time()
            if now - last_hist > 2:
                with self.history_lock:
                    self.state["history"].append(
                        {
                            "time": time.strftime("%H:%M:%S"),
                            "temp": round(self.state["room_temp"], 2),
                            "target": round(self.state["target_temp"], 2),
                            "pressure": round(self.state["boiler_pressure"], 2),
                        }
                    )
                    if len(self.state["history"]) > 50:
                        self.state["history"].pop(0)
                last_hist = now

            time.sleep(1)
