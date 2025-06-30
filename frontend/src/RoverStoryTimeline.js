import React from 'react';
import './RoverStoryTimeline.css';

// Props: stories (array), selectedDate, onDateSelect
export default function RoverStoryTimeline({ stories, selectedDate, onDateSelect }) {
  return (
    <div className="rover-story-timeline-container">
      <div className="rover-story-timeline-scroll">
        {stories.map(story => {
          const isSelected = story.date === selectedDate;
          return (
            <button
              key={story.date}
              className={`rover-story-timeline-event${isSelected ? ' selected' : ''}`}
              onClick={() => onDateSelect(story.date)}
              title={story.title}
            >
              <span className="story-dot" />
              <span className="story-title">{story.title}</span>
              <span className="story-date">{story.date}</span>
            </button>
          );
        })}
      </div>
      <div className="rover-story-timeline-legend">
        <span className="story-dot" /> Mission Event
        <span className="selected-box" /> Selected
      </div>
    </div>
  );
}
