import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import Button from './../components/Button';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setMinutes(25);
    setSeconds(0);
    setIsActive(false);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Pomodoro Timer</h1>
      <Card>
        <div className="text-center">
          <div className="text-6xl font-bold mb-8">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={toggleTimer}>
              {isActive ? 'Pause' : 'Start'}
            </Button>
            <Button variant="secondary" onClick={resetTimer}>
              Reset
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PomodoroTimer;
