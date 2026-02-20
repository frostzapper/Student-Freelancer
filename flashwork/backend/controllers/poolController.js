const { prisma } = require('../config/database');

const enterPool = async (req, res) => {
  try {
    const { start_time, end_time } = req.body;
    const workerId = req.user.id;

    const existingActive = await prisma.availability.findFirst({
      where: {
        worker_id: workerId,
        is_active: true
      }
    });

    if (existingActive) {
      return res.status(400).json({ error: 'Worker already has an active availability' });
    }

    const availability = await prisma.availability.create({
      data: {
        worker_id: workerId,
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        is_active: true
      }
    });

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const exitPool = async (req, res) => {
  try {
    const workerId = req.user.id;

    const updated = await prisma.availability.updateMany({
      where: {
        worker_id: workerId,
        is_active: true
      },
      data: {
        is_active: false
      }
    });

    res.json({ message: 'Exited pool successfully', count: updated.count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getActivePool = async (req, res) => {
  try {
    const { min_duration } = req.query;
    const currentTime = new Date();

    await prisma.availability.updateMany({
      where: {
        is_active: true,
        end_time: {
          lt: currentTime
        }
      },
      data: {
        is_active: false
      }
    });

    const activeAvailabilities = await prisma.availability.findMany({
      where: {
        is_active: true
      },
      select: {
        worker_id: true,
        start_time: true,
        end_time: true,
        worker: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    let formattedData = activeAvailabilities.map(avail => ({
      worker_id: avail.worker.id,
      name: avail.worker.name,
      start_time: avail.start_time,
      end_time: avail.end_time
    }));

    if (min_duration) {
      const minDurationMs = parseInt(min_duration) * 60 * 1000;
      formattedData = formattedData.filter(avail => {
        const duration = new Date(avail.end_time) - new Date(avail.start_time);
        return duration >= minDurationMs;
      });
    }

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  enterPool,
  exitPool,
  getActivePool
};
