import React, { useEffect, useState } from "react";
import "../App.css";

const alertsData = [
  { id: 1, message: "🚨 Flood Warning in Area XYZ", time: "Updated 5 min ago", color: "bg-red-100 border-red-500" },
  { id: 2, message: "☀️ Heatwave Alert in City ABC", time: "Updated 10 min ago", color: "bg-yellow-100 border-yellow-500" },
  { id: 3, message: "🌪️ Cyclone approaching Coastline", time: "Updated 20 min ago", color: "bg-blue-100 border-blue-500" },
  { id: 4, message: "🔥 Wildfire spreading in Forest Z", time: "Updated 30 min ago", color: "bg-orange-100 border-orange-500" },
];

const LiveAlerts = () => {
  const [alerts, setAlerts] = useState(alertsData);

  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts((prevAlerts) => [...prevAlerts.slice(1), prevAlerts[0]]);
    }, 3000); // Change alert every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full max-w-lg p-6 rounded-xl shadow-md overflow-hidden bg-white/20 backdrop-blur-lg border border-white/30">
      <h2 className="text-2xl font-semibold text-white mb-4">Live Disaster Alerts</h2>
      
      <div className="h-60 overflow-hidden">
        <div className="flex flex-col animate-scroll space-y-4">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-4 border-l-4 ${alert.color} text-gray-900 shadow-md`}>
              <p className="font-medium">{alert.message}</p>
              <p className="text-sm text-gray-600">{alert.time}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LiveAlerts;
