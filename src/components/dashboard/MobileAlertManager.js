import { useEffect, useState } from "react";
import { useSensorData } from "../../context/SensorContext";
import AlertIcon from "./AlertIcon";

export default function MobileAlertManager() {
  const { alerts, dismissAlert } = useSensorData();
  const [activeIcons, setActiveIcons] = useState([]);

  useEffect(() => {
    const activeAlerts = alerts.filter((alert) => alert.isActive);

    const alertsBySensor = activeAlerts.reduce((acc, alert) => {
      if (
        !acc[alert.sensorType] ||
        (acc[alert.sensorType].severity === "warning" &&
          alert.severity === "danger")
      ) {
        acc[alert.sensorType] = alert;
      }
      return acc;
    }, {});

    const uniqueAlerts = Object.values(alertsBySensor);

    uniqueAlerts.forEach((alert) => {
      if (!activeIcons.some((icon) => icon.sensorType === alert.sensorType)) {
        setActiveIcons((prev) => [...prev, alert]);
      }
    });

    setActiveIcons((prev) =>
      prev.filter((icon) =>
        uniqueAlerts.some((alert) => alert.sensorType === icon.sensorType)
      )
    );
  }, [alerts]);

  const handleDismiss = (alertId) => {
    setActiveIcons((prev) => prev.filter((icon) => icon.id !== alertId));
    dismissAlert(alertId);
  };

  const getIconPosition = (index) => {
    const spacing = 60;
    return { right: 20, top: 20 + index * spacing };
  };

  return (
    <>
      {activeIcons.map((alert, index) => (
        <AlertIcon
          key={`${alert.sensorType}-${alert.id}`}
          alert={alert}
          position={getIconPosition(index)}
          onDismiss={handleDismiss}
        />
      ))}
    </>
  );
}
