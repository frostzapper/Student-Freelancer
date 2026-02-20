const { prisma } = require('../config/database');

const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      base_price,
      pricing_mode,
      deadline,
      work_mode,
      ai_allowed,
      estimated_hours,
      urgent_status,
      auction_mode
    } = req.body;

    if (!estimated_hours) {
      return res.status(400).json({ error: 'Estimated hours is required' });
    }

    // Validate auction mode requires urgent
    const isAuctionMode = auction_mode === 'true' || auction_mode === true;
    const isUrgent = urgent_status === 'true' || urgent_status === true;
    
    if (isAuctionMode && !isUrgent) {
      return res.status(400).json({ error: 'Auction mode requires urgent to be enabled' });
    }

    const clientId = req.user.id;
    const jobPrice = parseFloat(base_price);

    const client = await prisma.user.findUnique({
      where: { id: clientId }
    });

    if (client.wallet_balance < jobPrice) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    await prisma.user.update({
      where: { id: clientId },
      data: {
        wallet_balance: {
          decrement: jobPrice
        }
      }
    });

    const question_file_url = req.file ? `/uploads/${req.file.filename}` : null;

    const job = await prisma.job.create({
      data: {
        title,
        description,
        base_price: jobPrice,
        current_price: jobPrice,
        pricing_mode,
        deadline: new Date(deadline),
        work_mode,
        ai_allowed: ai_allowed === 'true' || ai_allowed === true,
        question_file_url,
        status: 'open',
        urgent_status: isUrgent,
        auction_mode: isAuctionMode,
        estimated_hours: parseInt(estimated_hours),
        client_id: clientId
      }
    });

    await prisma.escrow.create({
      data: {
        job_id: job.id,
        locked_amount: jobPrice,
        status: 'locked',
        locked: true,
        client_id: clientId
      }
    });

    const jobWithEscrow = await prisma.job.findUnique({
      where: { id: job.id },
      include: { escrow: true }
    });

    res.status(201).json(jobWithEscrow);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOpenJobs = async (req, res) => {
  try {
    const { urgent_status, work_mode, ai_allowed, auction_mode, min_price, max_price } = req.query;

    const where = {
      status: 'open'
    };

    if (urgent_status !== undefined) {
      where.urgent_status = urgent_status === 'true';
    }

    if (work_mode) {
      where.work_mode = work_mode;
    }

    if (ai_allowed !== undefined) {
      where.ai_allowed = ai_allowed === 'true';
    }

    if (auction_mode !== undefined) {
      where.auction_mode = auction_mode === 'true';
    }

    if (min_price !== undefined || max_price !== undefined) {
      where.current_price = {};
      if (min_price !== undefined) {
        where.current_price.gte = parseFloat(min_price);
      }
      if (max_price !== undefined) {
        where.current_price.lte = parseFloat(max_price);
      }
    }

    const jobs = await prisma.job.findMany({
      where,
      orderBy: {
        created_at: 'desc'
      },
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
        estimated_hours: true,
        created_at: true
      }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const userId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        escrow: true,
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
        client: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check authorization
    const isClient = job.client_id === userId;
    const isWorker = job.workerEntity && (
      job.workerEntity.leader_id === userId ||
      job.workerEntity.groupMembers?.some(m => m.worker_id === userId)
    );
    const isOpenJob = job.status === 'open';

    // Allow access if: client, assigned worker, or job is open (for browsing)
    if (!isClient && !isWorker && !isOpenJob) {
      return res.status(403).json({ error: 'Not authorized to view this job' });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClientJobs = async (req, res) => {
  try {
    const clientId = req.user.id;

    const jobs = await prisma.job.findMany({
      where: { client_id: clientId },
      orderBy: { created_at: 'desc' },
      include: {
        escrow: true,
        workerEntity: {
          include: {
            groupMembers: true
          }
        }
      }
    });

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const acceptJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const workerId = req.user.id;
    const { mode, member_ids } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "open") {
      return res.status(400).json({ error: "Job is not available" });
    }

    const worker = await prisma.user.findUnique({
      where: { id: workerId }
    });

    if (worker.is_student) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());

      const activeJobs = await prisma.job.findMany({
        where: {
          workerEntity: {
            OR: [
              { leader_id: workerId },
              { groupMembers: { some: { worker_id: workerId } } }
            ],
            status: 'active'
          }
        },
        select: { estimated_hours: true }
      });

      const completedThisWeek = await prisma.job.findMany({
        where: {
          workerEntity: {
            OR: [
              { leader_id: workerId },
              { groupMembers: { some: { worker_id: workerId } } }
            ]
          },
          status: 'completed',
          updated_at: { gte: weekStart }
        },
        select: { estimated_hours: true }
      });

      const dailyHours = activeJobs.reduce((sum, j) => sum + (j.estimated_hours || 0), 0);
      const weeklyHours = [...activeJobs, ...completedThisWeek].reduce((sum, j) => sum + (j.estimated_hours || 0), 0);

      if (dailyHours + job.estimated_hours > worker.daily_hour_limit) {
        return res.status(400).json({ 
          error: `Daily hour limit exceeded. You can work ${worker.daily_hour_limit} hours per day. Current: ${dailyHours}, Job requires: ${job.estimated_hours}` 
        });
      }

      if (weeklyHours + job.estimated_hours > worker.weekly_hour_limit) {
        return res.status(400).json({ 
          error: `Weekly hour limit exceeded. You can work ${worker.weekly_hour_limit} hours per week. Current: ${weeklyHours}, Job requires: ${job.estimated_hours}` 
        });
      }
    }

    if (job.auto_group && job.work_mode === "group") {
      if (!job.required_group_size) {
        return res.status(400).json({ error: "Required group size not specified" });
      }

      const activeWorkers = await prisma.availability.findMany({
        where: {
          is_active: true
        },
        take: job.required_group_size,
        select: {
          worker_id: true,
          id: true
        }
      });

      if (activeWorkers.length < job.required_group_size) {
        return res.status(400).json({ 
          error: `Not enough workers available. Need ${job.required_group_size}, found ${activeWorkers.length}` 
        });
      }

      const workerIds = activeWorkers.map(w => w.worker_id);

      const workerEntity = await prisma.workerEntity.create({
        data: {
          job_id: jobId,
          type: "group",
          leader_id: workerIds[0],
          status: "active"
        }
      });

      for (const workerId of workerIds) {
        await prisma.workerGroupMember.create({
          data: {
            worker_entity_id: workerEntity.id,
            worker_id: workerId
          }
        });
      }

      for (const availability of activeWorkers) {
        await prisma.availability.update({
          where: { id: availability.id },
          data: { is_active: false }
        });
      }

      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: { status: "assigned" },
        include: {
          workerEntity: {
            include: {
              groupMembers: true
            }
          }
        }
      });

      return res.json(updatedJob);
    }

    if (!mode) {
      return res.status(400).json({ error: "Mode is required (solo or group)" });
    }

    const hasActiveJob = async (userId) => {
      const activeLeader = await prisma.workerEntity.findFirst({
        where: {
          leader_id: userId,
          status: "active"
        }
      });

      const activeMember = await prisma.workerGroupMember.findFirst({
        where: {
          worker_id: userId,
          workerEntity: {
            status: "active"
          }
        }
      });

      return activeLeader || activeMember;
    };

    if (mode === "solo") {

      if (await hasActiveJob(workerId)) {
        return res.status(400).json({ error: "Worker already has an active job" });
      }

      await prisma.workerEntity.create({
        data: {
          job_id: jobId,
          type: "solo",
          leader_id: workerId,
          status: "active"
        }
      });

      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: { status: "assigned" }
      });

      return res.json(updatedJob);
    }

    if (mode === "group") {

      if (!member_ids || member_ids.length === 0) {
        return res.status(400).json({ error: "Group members required" });
      }

      const uniqueMembers = [...new Set([...member_ids, workerId])];

      for (const memberId of uniqueMembers) {

        const user = await prisma.user.findUnique({
          where: { id: memberId }
        });

        if (!user || user.role !== "worker") {
          return res.status(400).json({ error: `Invalid worker: ${memberId}` });
        }

        if (await hasActiveJob(memberId)) {
          return res.status(400).json({
            error: `Worker ${memberId} already has an active job`
          });
        }
      }

      const workerEntity = await prisma.workerEntity.create({
        data: {
          job_id: jobId,
          type: "group",
          leader_id: workerId,
          status: "active"
        }
      });

      for (const memberId of uniqueMembers) {
        await prisma.workerGroupMember.create({
          data: {
            worker_entity_id: workerEntity.id,
            worker_id: memberId
          }
        });
      }

      const updatedJob = await prisma.job.update({
        where: { id: jobId },
        data: { status: "assigned" }
      });

      return res.json(updatedJob);
    }

    return res.status(400).json({ error: "Invalid mode" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const submitJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const workerId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { workerEntity: true }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'assigned') {
      return res.status(400).json({ error: 'Job is not in assigned status' });
    }

    if (!job.workerEntity || job.workerEntity.leader_id !== workerId) {
      return res.status(403).json({ error: 'Worker not assigned to this job' });
    }

    const submission_file_url = req.file ? `/uploads/${req.file.filename}` : null;

    await prisma.workerEntity.update({
      where: { id: job.workerEntity.id },
      data: { status: 'completed' }
    });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        status: 'submitted',
        submission_file_url
      },
      include: {
        workerEntity: true
      }
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const approveJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const clientId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        workerEntity: {
          include: {
            groupMembers: true
          }
        },
        escrow: true
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.client_id !== clientId) {
      return res.status(403).json({ error: 'Not authorized to approve this job' });
    }

    if (job.status !== 'submitted') {
      return res.status(400).json({ error: 'Job is not in submitted status' });
    }

    const platformCut = job.current_price * 0.01;
    const workerAmount = job.current_price - platformCut;

    await prisma.escrow.update({
      where: { id: job.escrow.id },
      data: { 
        status: 'released',
        locked: false
      }
    });

    if (job.workerEntity.type === 'group' && job.workerEntity.groupMembers.length > 0) {
      const totalMembers = job.workerEntity.groupMembers.length;
      const splitAmount = workerAmount / totalMembers;

      for (const member of job.workerEntity.groupMembers) {
        await prisma.user.update({
          where: { id: member.worker_id },
          data: {
            total_earnings: {
              increment: splitAmount
            },
            wallet_balance: {
              increment: splitAmount
            }
          }
        });
      }
    } else {
      await prisma.user.update({
        where: { id: job.workerEntity.leader_id },
        data: {
          total_earnings: {
            increment: workerAmount
          },
          wallet_balance: {
            increment: workerAmount
          }
        }
      });
    }

    await prisma.workerEntity.update({
      where: { id: job.workerEntity.id },
      data: { status: 'paid' }
    });

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: { status: 'completed' },
      include: {
        workerEntity: {
          include: {
            groupMembers: true
          }
        },
        escrow: true
      }
    });

    await prisma.trustFund.upsert({
      where: { id: 1 },
      update: {
        balance: { increment: platformCut }
      },
      create: {
        id: 1,
        balance: platformCut
      }
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const extendJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const workerId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { workerEntity: true }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (!job.workerEntity || job.workerEntity.leader_id !== workerId) {
      return res.status(403).json({ error: 'Worker not assigned as leader of this job' });
    }

    if (job.extension_count >= job.max_extensions) {
      return res.status(400).json({ error: 'Maximum extensions reached' });
    }

    const newPrice = job.current_price * 0.9;
    const newExtensionCount = job.extension_count + 1;
    const shouldBeUrgent = newExtensionCount >= job.max_extensions;

    const updatedJob = await prisma.job.update({
      where: { id: jobId },
      data: {
        current_price: newPrice,
        extension_count: newExtensionCount,
        urgent_status: shouldBeUrgent
      },
      include: {
        workerEntity: true
      }
    });

    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const bidOnJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const workerId = req.user.id;
    const { bidAmount, message } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (!job.auction_mode || !job.urgent_status) {
      return res.status(400).json({ error: 'Job is not in auction mode or not urgent' });
    }

    if (job.status !== 'open') {
      return res.status(400).json({ error: 'Job is no longer open for bidding' });
    }

    const bidAmountFloat = parseFloat(bidAmount);
    
    if (bidAmountFloat < job.current_price) {
      return res.status(400).json({ error: `Bid amount must be at least ₹${job.current_price}` });
    }

    // Check if worker already has a bid - update it if exists
    const existingBid = await prisma.auctionBid.findFirst({
      where: {
        job_id: jobId,
        worker_id: workerId
      }
    });

    let bid;
    if (existingBid) {
      // Update existing bid
      bid = await prisma.auctionBid.update({
        where: { id: existingBid.id },
        data: {
          bid_amount: bidAmountFloat,
          message: message || null
        }
      });
    } else {
      // Create new bid
      bid = await prisma.auctionBid.create({
        data: {
          job_id: jobId,
          worker_id: workerId,
          bid_amount: bidAmountFloat,
          message: message || null,
          status: 'pending'
        }
      });
    }

    res.status(201).json(bid);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getJobBids = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const clientId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.client_id !== clientId) {
      return res.status(403).json({ error: 'Not authorized to view bids for this job' });
    }

    const bids = await prisma.auctionBid.findMany({
      where: { job_id: jobId },
      include: {
        worker: {
          select: {
            id: true,
            name: true,
            reputation: true,
            total_reviews: true
          }
        }
      }
    });

    // Sort by bid amount DESC, then by reputation DESC
    const rankedBids = bids.sort((a, b) => {
      if (b.bid_amount !== a.bid_amount) {
        return b.bid_amount - a.bid_amount;
      }
      return b.worker.reputation - a.worker.reputation;
    });

    res.json(rankedBids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const selectWorker = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const clientId = req.user.id;
    const { bid_id } = req.body;

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: { escrow: true }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.client_id !== clientId) {
      return res.status(403).json({ error: 'Not authorized to select worker for this job' });
    }

    if (!job.auction_mode) {
      return res.status(400).json({ error: 'Job is not in auction mode' });
    }

    // Get the accepted bid
    const acceptedBid = await prisma.auctionBid.findUnique({
      where: { id: bid_id },
      include: { worker: true }
    });

    if (!acceptedBid || acceptedBid.job_id !== jobId) {
      return res.status(404).json({ error: 'Bid not found' });
    }

    // Calculate price difference
    const priceDifference = acceptedBid.bid_amount - job.current_price;
    
    // If bid is higher, client needs to pay the difference
    if (priceDifference > 0) {
      const client = await prisma.user.findUnique({
        where: { id: clientId }
      });

      if (client.wallet_balance < priceDifference) {
        return res.status(400).json({ error: 'Insufficient wallet balance to accept this bid' });
      }

      // Deduct difference from client wallet
      await prisma.user.update({
        where: { id: clientId },
        data: {
          wallet_balance: {
            decrement: priceDifference
          }
        }
      });
    }

    // Update job price and status
    await prisma.job.update({
      where: { id: jobId },
      data: {
        current_price: acceptedBid.bid_amount,
        status: 'assigned',
        auction_mode: false
      }
    });

    // Update escrow with new amount
    await prisma.escrow.update({
      where: { job_id: jobId },
      data: {
        locked_amount: acceptedBid.bid_amount
      }
    });

    // Create worker entity
    await prisma.workerEntity.create({
      data: {
        job_id: jobId,
        type: 'solo',
        leader_id: acceptedBid.worker_id,
        status: 'active'
      }
    });

    // Update accepted bid status
    await prisma.auctionBid.update({
      where: { id: bid_id },
      data: { status: 'accepted' }
    });

    // Reject all other bids
    await prisma.auctionBid.updateMany({
      where: {
        job_id: jobId,
        id: { not: bid_id }
      },
      data: { status: 'rejected' }
    });

    const updatedJob = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        workerEntity: true,
        escrow: true
      }
    });

    res.json({ job: updatedJob, acceptedBid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const rateJob = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const clientId = req.user.id;
    const { rating } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        workerEntity: {
          include: {
            groupMembers: true
          }
        }
      }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.client_id !== clientId) {
      return res.status(403).json({ error: 'Not authorized to rate this job' });
    }

    if (job.status !== 'completed') {
      return res.status(400).json({ error: 'Job must be completed before rating' });
    }

    if (job.rated) {
      return res.status(400).json({ error: 'Job has already been rated' });
    }

    const ratingValue = parseFloat(rating);
    const updatedWorkers = [];

    if (job.workerEntity.type === 'group' && job.workerEntity.groupMembers.length > 0) {
      for (const member of job.workerEntity.groupMembers) {
        const worker = await prisma.user.findUnique({
          where: { id: member.worker_id }
        });

        const newTotalReviews = worker.total_reviews + 1;
        const newReputation = ((worker.reputation * worker.total_reviews) + ratingValue) / newTotalReviews;

        const updatedWorker = await prisma.user.update({
          where: { id: member.worker_id },
          data: {
            reputation: newReputation,
            total_reviews: newTotalReviews
          }
        });

        updatedWorkers.push(updatedWorker);
      }
    } else {
      const worker = await prisma.user.findUnique({
        where: { id: job.workerEntity.leader_id }
      });

      const newTotalReviews = worker.total_reviews + 1;
      const newReputation = ((worker.reputation * worker.total_reviews) + ratingValue) / newTotalReviews;

      const updatedWorker = await prisma.user.update({
        where: { id: job.workerEntity.leader_id },
        data: {
          reputation: newReputation,
          total_reviews: newTotalReviews
        }
      });

      updatedWorkers.push(updatedWorker);
    }

    await prisma.job.update({
      where: { id: jobId },
      data: { rated: true }
    });

    res.json({
      message: 'Job rated successfully',
      workers: updatedWorkers.map(w => ({
        id: w.id,
        name: w.name,
        reputation: w.reputation,
        total_reviews: w.total_reviews
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user.skills || (Array.isArray(user.skills) && user.skills.length === 0)) {
      return res.json({
        message: 'NO_SKILLS',
        jobs: []
      });
    }

    const userSkills = Array.isArray(user.skills) ? user.skills : [];

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
        estimated_hours: true,
        created_at: true
      }
    });

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

    res.json(jobsWithScores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

getWorkerBidInfo = async (req, res) => {
  try {
    const jobId = parseInt(req.params.id);
    const workerId = req.user.id;

    const job = await prisma.job.findUnique({
      where: { id: jobId }
    });

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Get total bid count
    const bidCount = await prisma.auctionBid.count({
      where: { job_id: jobId }
    });

    // Get worker's own bid if exists
    const workerBid = await prisma.auctionBid.findFirst({
      where: {
        job_id: jobId,
        worker_id: workerId
      }
    });

    res.json({
      bidCount,
      workerBid: workerBid || null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createJob,
  getOpenJobs,
  getJobById,
  getClientJobs,
  acceptJob,
  submitJob,
  approveJob,
  extendJob,
  bidOnJob,
  getJobBids,
  selectWorker,
  rateJob,
  getRecommendedJobs,
  getWorkerBidInfo
};
