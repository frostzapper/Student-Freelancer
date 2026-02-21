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

const getWorkerJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    // If user is not a worker, return empty array
    if (userRole !== 'worker' && userRole !== 'both') {
      return res.json([]);
    }

    // Get all jobs where this worker is the leader or a group member
    const jobs = await prisma.job.findMany({
      where: {
        workerEntity: {
          OR: [
            { leader_id: userId },
            { groupMembers: { some: { worker_id: userId } } }
          ]
        }
      },
      include: {
        workerEntity: {
          include: {
            groupMembers: {
              include: {
                worker: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        escrow: true,
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    res.json(jobs);
  } catch (error) {
    console.error('Error in getWorkerJobs:', error);
    res.status(500).json({ error: error.message });
  }
};

const getDailyAlert = async (req, res) => {
  try {
    const workerId = req.user.id;
    const today = new Date();
    const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay();

    const todaySchedule = await prisma.workerSchedule.findMany({
      where: {
        worker_id: workerId,
        day_of_week: dayOfWeek
      }
    });

    if (todaySchedule.length === 0) {
      return res.json({
        todaySchedule: [],
        recommendedJobs: [],
        message: 'No schedule set for today',
        urgentJobsAvailable: 0
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: workerId }
    });

    const userSkills = user.skills && Array.isArray(user.skills) ? user.skills : [];

    const openJobs = await prisma.job.findMany({
      where: { status: 'open' },
      select: {
        id: true,
        title: true,
        description: true,
        current_price: true,
        pricing_mode: true,
        deadline: true,
        work_mode: true,
        ai_allowed: true,
        question_file_url: true,
        urgent_status: true,
        auction_mode: true,
        auction_end: true,
        created_at: true
      }
    });

    const urgentJobsAvailable = openJobs.filter(job => job.urgent_status).length;

    let recommendedJobs = [];
    if (userSkills.length > 0) {
      const jobsWithScores = openJobs.map(job => {
        let matchScore = 0;
        const titleLower = job.title.toLowerCase();
        const descLower = job.description.toLowerCase();

        for (const skill of userSkills) {
          const skillLower = skill.toLowerCase();
          if (titleLower.includes(skillLower) || descLower.includes(skillLower)) {
            matchScore += 10;
          }
        }

        const maxScore = (userSkills.length * 10) + 5;
        const matchPercent = maxScore > 0 ? Math.round((matchScore / maxScore) * 100) : 0;

        return {
          ...job,
          matchScore,
          matchPercent
        };
      });

      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
      recommendedJobs = jobsWithScores.slice(0, 5);
    }

    const totalFreeHours = todaySchedule.reduce((total, schedule) => {
      const [startHour] = schedule.start_time.split(':').map(Number);
      const [endHour] = schedule.end_time.split(':').map(Number);
      return total + (endHour - startHour);
    }, 0);

    res.json({
      todaySchedule,
      recommendedJobs,
      message: `You have ${totalFreeHours} free hours today`,
      urgentJobsAvailable
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getWorkerDashboard,
  getDailyAlert,
  getWorkerJobs
};
