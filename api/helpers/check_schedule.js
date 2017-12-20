const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

module.exports = (schedule) => {
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
};
