const { prisma } = require('../config/database');

const getWorkerDashboard = async (req, res) => {
  try {
    const workerId = req.user.id;

    const completedJobs = await prisma.job.findMany({
      where: {
        workerEntity: {
          leader_id: workerId
        },
        status: 'completed'
      },
      select: {
        current_price: true,
        created_at: true,
        updated_at: true
      }
    });

    const total_earnings = completedJobs.reduce((sum, job) => sum + job.current_price, 0);
    const total_completed_jobs = completedJobs.length;

    const total_active_jobs = await prisma.job.count({
      where: {
        workerEntity: {
          leader_id: workerId
        },
        status: 'assigned'
      }
    });

    const total_pending_jobs = await prisma.job.count({
      where: {
        workerEntity: {
          leader_id: workerId
        },
        status: 'submitted'
      }
    });

    const monthly_earnings = {};
    completedJobs.forEach(job => {
      const date = job.updated_at || job.created_at;
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthly_earnings[monthKey] = (monthly_earnings[monthKey] || 0) + job.current_price;
    });

    res.json({
      total_earnings,
      total_completed_jobs,
      total_active_jobs,
      total_pending_jobs,
      monthly_earnings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWorkerDashboard
};
