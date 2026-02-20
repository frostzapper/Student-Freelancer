const { prisma } = require('../config/database');

const getTrustFundBalance = async (req, res) => {
  try {
    const trustFund = await prisma.trustFund.findUnique({
      where: { id: 1 }
    });

    const balance = trustFund ? trustFund.balance : 0;

    res.json({ balance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTrustFundBalance
};
