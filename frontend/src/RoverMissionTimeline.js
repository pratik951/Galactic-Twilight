import React from 'react';
import './RoverMissionTimeline.css';

// Props: dates (array), milestones (array of {date, label}), selectedDate, onDateSelect
export default function RoverMissionTimeline({ dates, milestones = [], selectedDate, onDateSelect }) {
  // Create a Set for quick milestone lookup
  const milestoneMap = new Map(milestones.map(m => [m.date, m.label]));

  return (
    <div className="rover-timeline-container">
      <div className="rover-timeline-scroll">
        {dates.map(date => {
          const isMilestone = milestoneMap.has(date);
          const isSelected = date === selectedDate;
          return (
            <button
              key={date}
              className={`rover-timeline-date${isMilestone ? ' milestone' : ''}${isSelected ? ' selected' : ''}`}
              title={isMilestone ? milestoneMap.get(date) : date}
              onClick={() => onDateSelect(date)}
            >
              {isMilestone ? <span className="milestone-dot" /> : null}
              <span className="date-label">{date}</span>
            </button>
          );
        })}
      </div>
      <div className="rover-timeline-legend">
        <span className="milestone-dot" /> Milestone
        <span className="selected-box" /> Selected
      </div>
    </div>
  );
}
