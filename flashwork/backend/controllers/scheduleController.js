const { prisma } = require('../config/database');

const dayNameToNumber = {
  'monday': 1,
  'tuesday': 2,
  'wednesday': 3,
  'thursday': 4,
  'friday': 5,
  'saturday': 6,
  'sunday': 7
};

const dayNumberToName = {
  1: 'monday',
  2: 'tuesday',
  3: 'wednesday',
  4: 'thursday',
  5: 'friday',
  6: 'saturday',
  7: 'sunday'
};

const createSchedule = async (req, res) => {
  try {
    const { day_of_week, start_time, end_time } = req.body;
    const workerId = req.user.id;

    // Convert day name to number if it's a string
    const dayNumber = typeof day_of_week === 'string' 
      ? dayNameToNumber[day_of_week.toLowerCase()] 
      : parseInt(day_of_week);

    const schedule = await prisma.workerSchedule.create({
      data: {
        worker_id: workerId,
        day_of_week: dayNumber,
        start_time,
        end_time
      }
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSchedule = async (req, res) => {
  try {
    const workerId = req.user.id;

    const schedules = await prisma.workerSchedule.findMany({
      where: { worker_id: workerId },
      orderBy: { day_of_week: 'asc' }
    });

    // Convert day numbers to names
    const schedulesWithDayNames = schedules.map(schedule => ({
      ...schedule,
      day_of_week: dayNumberToName[schedule.day_of_week] || schedule.day_of_week
    }));

    res.json(schedulesWithDayNames);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteSchedule = async (req, res) => {
  try {
    const scheduleId = parseInt(req.params.id);
    const workerId = req.user.id;

    const schedule = await prisma.workerSchedule.findUnique({
      where: { id: scheduleId }
    });

    if (!schedule) {
      return res.status(404).json({ error: 'Schedule not found' });
    }

    if (schedule.worker_id !== workerId) {
      return res.status(403).json({ error: 'Not authorized to delete this schedule' });
    }

    await prisma.workerSchedule.delete({
      where: { id: scheduleId }
    });

    res.json({ message: 'Schedule deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createSchedule,
  getSchedule,
  deleteSchedule
};
