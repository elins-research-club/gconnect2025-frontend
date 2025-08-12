// src/components/dashboard/SensorCard.js
const SensorCard = ({ title, value, unit, statusColor = "" }) => {
  return (
    <div className="bg-background-card p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center border border-background-border transform hover:-translate-y-1 ">
      <h3 className="text-xl font-semibold mb-3 text-text-light">{title}</h3>
      <p className={`text-5xl font-extrabold ${statusColor} mb-2`}>
        {value}
        {unit && <span className="text-2xl ml-1 text-text-dark">{unit}</span>}
      </p>
      <div className="mt-4 text-sm text-text-dark">
        Status: <span className={statusColor}>Normal</span>
      </div>
    </div>
  );
};

export default SensorCard;
