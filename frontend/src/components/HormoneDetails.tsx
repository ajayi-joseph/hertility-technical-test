import { OutOfRangeHormone } from '../types/results';

interface HormoneDetailsProps {
  outOfRangeHormones: OutOfRangeHormone[];
}

interface RangeBarProps {
  hormone: OutOfRangeHormone;
}

const RangeBar = ({ hormone }: RangeBarProps) => {
  const min = hormone.expectedMin;
  const max = hormone.expectedMax;
  const value = hormone.value;
  const range = max - min;
  const bufferPercentage = 0.2;
  
  const extendedMin = min - (range * bufferPercentage);
  const extendedMax = max + (range * bufferPercentage);
  const extendedRange = extendedMax - extendedMin;
  
  const normalStartPercent = ((min - extendedMin) / extendedRange) * 100;
  const normalWidthPercent = (range / extendedRange) * 100;
  const valuePercent = Math.max(0, Math.min(100, ((value - extendedMin) / extendedRange) * 100));
  
  const isTooHigh = value > max;
  const isTooLow = value < min;
  
  return (
    <div className="rangeBarContainer">
      <div className="rangeBarTrack">
        <div 
          className="rangeBarNormal"
          style={{
            left: `${normalStartPercent}%`,
            width: `${normalWidthPercent}%`
          }}
        />
        <div 
          className={`rangeBarMarker ${
            isTooHigh ? 'rangeBarMarkerHigh' : 
            isTooLow ? 'rangeBarMarkerLow' : 
            'rangeBarMarkerNormal'
          }`}
          style={{ left: `${valuePercent}%` }}
        />
      </div>
      <div className="rangeBarLabels">
        <span className="rangeLabel">{min}</span>
        <span className="rangeLabel">{max}</span>
      </div>
    </div>
  );
};

export const HormoneDetails = ({ outOfRangeHormones }: HormoneDetailsProps) => {
  if (outOfRangeHormones.length === 0) {
    return (
      <div className="hormoneDetails">
        <p>All hormones are within normal range.</p>
      </div>
    );
  }

  return (
    <div className="hormoneDetails">
      <h4>Out of range hormones:</h4>
      <ul>
        {outOfRangeHormones.map(hormone => (
          <li key={hormone.code}>
            <div className="hormoneItem">
              <div className="hormoneHeader">
                <strong>{hormone.code}</strong>: {hormone.value} {hormone.units}
                <span className="expectedRange">
                  (normal: {hormone.expectedMin}-{hormone.expectedMax} {hormone.units})
                </span>
              </div>
              <RangeBar hormone={hormone} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};