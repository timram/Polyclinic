const validDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function checkNewSchedule(schedule) {
  try {
    const days = Object.keys(schedule);
    const intersection = validDays.filter(day => days.includes(day));

    if (days.length !== validDays.length || intersection.length !== validDays.length) {
      throw new Error();
    }

    days.forEach((day) => {
      if (schedule[day] === 'off') {
        return;
      }

      const [startHour, startMin] = schedule[day].start.split(':');
      const [endHour, endMin] = schedule[day].end.split(':');

      [startHour, endHour].forEach((val) => {
        const hour = parseFloat(val);
        if ((!hour && hour !== 0) || hour < 0 || hour > 24) {
          console.log(hour);
          throw new Error();
        }
      });

      [startMin, endMin].forEach((val) => {
        const minute = parseFloat(val);
        if ((!minute && minute !== 0) || minute < 0 || minute > 60) {
          console.log(minute);
          throw new Error();
        }
      });
    });
  } catch (err) {
    const error = new Error('not valid schedule!');
    error.status = 400;
    throw error;
  }
}

function isValidRecordTime({ time, schedule }) {
  const day = schedule[validDays[time.getDay()]];

  if (day === 'off') {
    return false;
  }

  const startTime = parseFloat(day.start.replace(':', '.'));
  const endTime = parseFloat(day.end.replace(':', '.'));
  const targetTime = parseFloat(`${time.getHours()}.${time.getMinutes()}`);

  return targetTime >= startTime && targetTime <= endTime;
}


module.exports = {
  checkNewSchedule,
  isValidRecordTime
};
